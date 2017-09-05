import { Component } from '@angular/core';
import { NavController, NavParams, Events, ToastController, LoadingController, Platform } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Facebook, GooglePlus } from 'ionic-native';
import { Push, PushToken } from '@ionic/cloud-angular';
import { NativeStorage } from '@ionic-native/native-storage';

import { HomePage } from '../home/home';
import { SignUpPage } from '../sign-up/sign-up';
import { DashboardStudentPage } from '../dashboard-student/dashboard-student';
import { DashboardTutorPage } from '../dashboard-tutor/dashboard-tutor';

declare var navigator: any;
declare var Connection: any;

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage {
  	platform: Platform;
	_langs: Array<{value: string, name: string, checked: string}>;
	_default_lang: any;
	_email: string;
	_password: string;
	FB_APP_ID: number = 1124368604282869;
	_user_email: string;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public events: Events, 
		private translate: TranslateService, 
		public http: Http, 
		public toastCtrl: ToastController, 
		public loadingCtrl: LoadingController, 
		platform: Platform,
		public push: Push,
		private nativeStorage: NativeStorage
		){
  		this._langs = [
		    {value: "en", name: "English", checked: translate.currentLang=="en" ? "true" : "false"},
		    {value: "id", name: "Bahasa Indonesia", checked: translate.currentLang=="id" ? "true" : "false"}
		  ];
		this._default_lang = translate.currentLang;

		// facebook browser init
		// Facebook.browserInit(this.FB_APP_ID, "v2.8");

		
  	}
    
    open_home() {
      this.navCtrl.push(HomePage);
    }

  	open_signup(as_role) {
    	this.navCtrl.push(SignUpPage, {role: as_role});
  	}

  	change_lang($lang_id){
	  	this.translate.setDefaultLang($lang_id);
	  	this.translate.use($lang_id);
  	}

  	store_data_session(data){
  		var user_role = '';
	    if(data.user_level=="teacher")
	      user_role = "tutor";
	    else if(data.user_level=="student")
	      user_role = "student";
	      
  		this.nativeStorage.setItem('logged_user', 
    		{	id: data.user_id, 
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

  	do_login(){
  		let loading = this.loadingCtrl.create({
		    content: 'Please wait...'
		  });

		  loading.present();
	  	
	  	var _encoded_email = encodeURI(this._email);
	  	var _encoded_pass	= encodeURI(this._password);
	  	var _uri_string = 'http://tutordoors.com/api/user/login_data/';
	  	
	  	let body = new FormData();
	    body.append('email', _encoded_email);
	    body.append('pass', _encoded_pass);

	  	this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
	    	// console.log(data);
	    	loading.dismiss();
	    	if(data.length == 0){
	    		let toast = this.toastCtrl.create({
			      message: 'User not found',
			      duration: 3000
			    });
			    toast.present();
	    	}
	    	else{
	    		this.store_data_session(data[0]);
	    	}
	    	

	    }, error => {
	    	// this.checkConnection();
	    	loading.dismiss();
	        let toast = this.toastCtrl.create({
			      message: error,
			      duration: 3000
			    });
			    toast.present();
	    });

	}

	checkConnection() {
	    var networkState = navigator.connection.type;

	    var states = {};
	    states[Connection.UNKNOWN]  = 'Unknown connection';
	    states[Connection.ETHERNET] = 'Ethernet connection';
	    states[Connection.WIFI]     = 'WiFi connection';
	    states[Connection.CELL_2G]  = 'Cell 2G connection';
	    states[Connection.CELL_3G]  = 'Cell 3G connection';
	    states[Connection.CELL_4G]  = 'Cell 4G connection';
	    states[Connection.CELL]     = 'Cell generic connection';
	    states[Connection.NONE]     = 'No network connection';

	    let toast = this.toastCtrl.create({
  			message: 'Checking Connection: ' + states[networkState],
  			duration: 3000
  			});
  		toast.present();
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
	   	// let userId = response.authResponse.userID;
	   	 let params = new Array();
	      
	     Facebook.api("/me?fields=id,name,first_name,last_name,link,email,picture", params)
	       .then(function(user) {
	           _this._user_email = user.email;
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
    let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

    loading.present();

    GooglePlus.login({
      'scopes': 'profile email', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '111926407216-hhshekpjf718dnlocj6ho5qqbava6e2c.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true
    })
     .then(function(userdata){
       console.log(userdata);
       _this._user_email = userdata.email;
       _this.post_socmed_login(userdata.email);
       loading.dismiss();
     }, 
     function(error){
       console.log(error);
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
	      let toast = this.toastCtrl.create({
          message: 'User not found. Please register on sign up page',
          duration: 3000
        });
        toast.present();
	    }
	    else{
	    	this.store_data_session(data[0]);
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
