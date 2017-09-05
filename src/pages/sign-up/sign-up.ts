import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage, Facebook, GooglePlus } from 'ionic-native';

import { LoginPage } from '../login/login';
import { SignupForm1Page } from '../signup-form1/signup-form1';
import { DashboardStudentPage } from '../dashboard-student/dashboard-student';
import { DashboardTutorPage } from '../dashboard-tutor/dashboard-tutor';
import { SignupForm2Page } from '../signup-form2/signup-form2';

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html'
})
export class SignUpPage {
	_role: any;
	_langs: Array<{value: string, name: string, checked: string}>;
	_default_lang: any;
	_title: any;
  _user_email: string;
  _user_fn: string;
  _user_ln: string;
  _translate: any;
  _socmed_photo_id: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private translate: TranslateService, 
    public http: Http, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this._translate = translate;
  	this._role = navParams.get('role');
  	if(this._role=='teacher')
  		this._title = 'Login.become_tutor';
  	else if(this._role=='student')
  		this._title = 'Login.become_student';

  	this._langs = [
	    {value: "en", name: "English", checked: translate.currentLang=="en" ? "true" : "false"},
	    {value: "id", name: "Bahasa Indonesia", checked: translate.currentLang=="id" ? "true" : "false"}
	  ];
		this._default_lang = translate.currentLang;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  open_login(){
  	this.navCtrl.push(LoginPage);
  }

  change_lang($lang_id){
  	this.translate.setDefaultLang($lang_id);
  	this.translate.use($lang_id);
  }

  open_signup_form(){
  	this.navCtrl.push(SignupForm1Page, {role: this._role});
  }
  
  store_data_session(data){
    var user_role = '';
    if(data.user_level=="teacher")
      user_role = "tutor";
    else if(data.user_level=="student")
      user_role = "student";

    NativeStorage.setItem('logged_user', 
      { id: data.user_id, 
        email: data.email_login,
        fn: data.first_name,
        ln: data.last_name,
        role: data.user_level,
        verified: data.verified_user,
        checkpoint_page: 'dashboard-'+user_role
      })
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
      
      if(data.user_level == 'teacher')
        this.navCtrl.setRoot(DashboardTutorPage);
      else if(data.user_level == 'student')
        this.navCtrl.setRoot(DashboardStudentPage);
    }
  
  doFbLogin(){
    let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

    loading.present();
    
    let permissions = new Array();
    //the permissions your facebook app needs from the user
    permissions = ["public_profile"];
    var _this = this;
    
    Facebook.login(permissions)
     .then(function(response){
        let userId = response.authResponse.userID;
        
        // generate fb photo in server db
        /*let body = new FormData();
        body.append('userid', userId);
        body.append('media', 'facebook');
        _this.http.post("http://tutordoors.com/api/user/socmed_image/", body).map(res => res.json()).subscribe(data => {
          _this._socmed_photo_id = data.image_id;
        }, error => {
          let toast = _this.toastCtrl.create({
            message: error,
            duration: 3000
          });
          toast.present();
        });*/

        // accessing graph API
        let params = new Array();        
        Facebook.api("/me?fields=id,name,first_name,last_name,link,email,picture", params)
         .then(function(user) {
           _this._user_email = user.email;
           _this._user_fn = user.first_name;
           _this._user_ln = user.last_name;
           _this.post_socmed_login(user.email);
           loading.dismiss();
         }, function(error){
           loading.dismiss();
         });
     }, function(error){
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: error,
          duration: 3000
          });
        toast.present();
     });
    
  }
  
  doGoogleLogin(){
    var _this = this;
    var user_email = '';
    let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

    loading.present();

    GooglePlus.login({
      'scopes': 'profile email', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '111926407216-6te4dddtprhovikfequ61tc1t6lgbnq3.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true
    })
     .then(function(userdata){
        /*console.log(userdata);
        // generate photo in server db
        let body = new FormData();
        body.append('google_image_url', userdata.imageUrl);
        body.append('media', 'google');
        _this.http.post("http://tutordoors.com/api/user/socmed_image/", body).map(res => res.json()).subscribe(data => {
          _this._socmed_photo_id = data.image_id;
        }, error => {
          let toast = _this.toastCtrl.create({
            message: error,
            duration: 3000
          });
          toast.present();
        });*/

        _this._user_fn = userdata.givenName;
        _this._user_ln = userdata.familyName;
        _this._user_email = userdata.email;
        _this.post_socmed_login(userdata.email);
        loading.dismiss();
     }, 
     function(error){
       let toast = _this.toastCtrl.create({
            message: 'error: '+error,
            duration: 5000
          });
          toast.present();
       loading.dismiss();
     });
  }

  post_socmed_login(email){
    var _encoded_email = encodeURI(email);
    var _uri_string = 'http://tutordoors.com/api/user/email_exist/';
    
    let body = new FormData();
    body.append('email', _encoded_email);

    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
      console.log(data);
      if(data.length == 0){
        // redirect to sign up form page for socmed redirection
        this.navCtrl.push(SignupForm2Page, {
            role: this._role,
            email: this._user_email,
            fn: this._user_fn,
            ln: this._user_ln
            });
      }
      else{
        var toast_string: string;
        this._translate.get('user_has_already_registered_redirect_to_dashboard').subscribe(res => {toast_string = res});
        let toast = this.toastCtrl.create({
          message: toast_string,
          duration: 3000
          });
        toast.present();
        this.store_data_session(data[0]);
        if(data[0].user_level == "teacher")
          this.navCtrl.push(DashboardTutorPage);
        else if(data[0].user_level == "student")
          this.navCtrl.push(DashboardStudentPage);
      }

    }, error => {
      // this.checkConnection();
      let toast = this.toastCtrl.create({
        message: error,
        duration: 3000
      });
      toast.present();
    });
  }
}
