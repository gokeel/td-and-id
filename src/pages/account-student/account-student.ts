import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController, App, ModalController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';
import { Push, PushToken } from '@ionic/cloud-angular';

import { EditProfileStudentPage } from '../edit-profile-student/edit-profile-student';
import { HomePage } from '../home/home';
import { NotificationPage } from '../notification/notification';
import { MailboxTabsPage } from '../mailbox-tabs/mailbox-tabs';
import { PopPostPage } from '../pop-post/pop-post';

@Component({
  selector: 'page-account-student',
  templateUrl: 'account-student.html'
})
export class AccountStudentPage {
	_logged_user: any;
	_user_id: any;
  _translate: any;
  _file_url: string;
  _fullname: string;
  _school: string;
  _mobile: string;
  _email: string;
  _token_id: string;
  _term: any;
  _term_title: any;
  _pol: any;
  _pol_title: any;
  _uri_string: string;
	
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    private app: App,
    public push: Push,
    public modalCtrl: ModalController,
    private nativeStorage: NativeStorage
  ) {
  	this._translate = translate;
  	let env = this;
    this.nativeStorage.getItem('logged_user')
        .then( function (data) {
          env._logged_user = data;
          env._user_id = data.id;
          env.get_profile(data.id);
        }, function (error) {
          let toast = env.toastCtrl.create({
            message: 'No logged user',
            duration: 3000
          });
          toast.present();
        });
        
    this.nativeStorage.getItem('push_token')
      .then( function (data) {
        env._token_id = data.token_id;
      }, function (error) {});

    if(translate.currentLang == "id")
      this._uri_string = 'http://tutordoors.com/content/feed_page_json/syarat-dan-ketentuan';
    else
      this._uri_string = 'http://tutordoors.com/content/feed_page_json/terms-and-conditions';

    this.http.get(this._uri_string).map(res => res.json()).subscribe(data => {
      this._term = data.content;
      this._term_title = data.title;
    });

    // get term condition text
    if(translate.currentLang == "id")
      this._uri_string = 'http://tutordoors.com/content/feed_page_json/kebijakan-privasi';
    else
      this._uri_string = 'http://tutordoors.com/content/feed_page_json/privacy-policy';

    this.http.get(this._uri_string).map(res => res.json()).subscribe(data => {
      this._pol = data.content;
      this._pol_title = data.title;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountStudentPage');
  }

  edit_profile(){
  	this.app.getRootNav().push(EditProfileStudentPage, {user_id: this._user_id});
  }

  get_profile(user_id){
	  this.http.get('http://tutordoors.com/api/student/personal/lang/'+this._translate.currentLang+'/id/'+user_id).map(res => res.json()).subscribe(data => {
	  			this._fullname = data.first_name+' '+data.last_name;
	        this._file_url = 'http://tutordoors.com/assets/uploads/'+data.file_name;
	        this._mobile = data.phone_1;
	        this._school = data.where_student_school;
          this._email = data.email_login;
	    }, error => {
        let toast = this.toastCtrl.create({
          message: error,
          duration: 3000
        });
        toast.present();
    });
  }

  do_signout(){
    this.nativeStorage.clear();
    this.push.unregister();
    // store token in db
    var _uri_string = 'http://tutordoors.com/api/push/delete_token/';
    let body = new FormData();
    body.append('token_id', this._token_id);
    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
        console.log('Token not active');
      }, error => {
        // this.checkConnection();
        let toast = this.toastCtrl.create({
            message: error,
            duration: 3000
          });
          toast.present();
      });
    this.app.getRootNav().setRoot(HomePage);
  }

  goto_notification(){
    this.app.getRootNav().push(NotificationPage, {user_id: this._user_id});
  }

  goto_mailbox(){
    this.app.getRootNav().push(MailboxTabsPage, {user_id: this._user_id});
  }

  alert_term() {
    let popover = this.modalCtrl.create(PopPostPage, {
      title: this._term_title,
      content: this._term
    });
    popover.present();
  }

  alert_policy() {
    let popover = this.modalCtrl.create(PopPostPage, {
      title: this._pol_title,
      content: this._pol
    });
    popover.present();
  }
}
