import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController, App, ModalController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';
import { Push, PushToken } from '@ionic/cloud-angular';

import { EditProfileTutorPage } from '../edit-profile-tutor/edit-profile-tutor';
import { HomePage } from '../home/home';
import { TutorOpenedCityPage } from '../tutor-opened-city/tutor-opened-city';
import { TutorOpenedCoursePage } from '../tutor-opened-course/tutor-opened-course';
import { NotificationPage } from '../notification/notification';
import { MailboxTabsPage } from '../mailbox-tabs/mailbox-tabs';
import { OtestAssignmentListPage } from '../otest-assignment-list/otest-assignment-list';
import { BankAccountPage } from '../bank-account/bank-account';
import { TutorCommissionPage } from '../tutor-commission/tutor-commission';
import { PopPostPage } from '../pop-post/pop-post';
import { RunningCoursePage } from '../running-course/running-course';
import { ChangeLanguagePage } from '../change-language/change-language';

@Component({
  selector: 'page-account-tutor',
  templateUrl: 'account-tutor.html'
})
export class AccountTutorPage {
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
  _role: string;

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
          env._role = data.role;
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
    console.log('ionViewDidLoad AccountTutorPage');
  }

  ionViewWillEnter(){
  	console.log('ionViewWillEnter AccountTutorPage');
  }

  ionViewDidEnter(){
  	console.log('ionViewDidEnter AccountTutorPage');
  	// this.get_profile(this._user_id);
  }

  edit_profile(){
  	this.app.getRootNav().push(EditProfileTutorPage, {user_id: this._user_id});
  }

  get_profile(user_id){
	  this.http.get('http://tutordoors.com/api/tutor/personal/lang/'+this._translate.currentLang+'/id/'+user_id).map(res => res.json()).subscribe(data => {
	  			this._user_id = user_id;
	  			this._fullname = data.profile.first_name+' '+data.profile.last_name;
	        this._file_url = 'http://tutordoors.com/assets/uploads/'+data.profile.file_name;
	        this._mobile = data.profile.phone_1;
	        this._school = data.profile.where_student_school;
	        this._email = data.profile.email_login;
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
    // delete token in db
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

  goto_open_city(){
  	this.app.getRootNav().push(TutorOpenedCityPage, {tutor_id: this._user_id});
  }

  goto_open_course(){
  	this.app.getRootNav().push(TutorOpenedCoursePage, {tutor_id: this._user_id});
  }

  goto_notification(){
    this.app.getRootNav().push(NotificationPage, {user_id: this._user_id});
  }

  goto_mailbox(){
    this.app.getRootNav().push(MailboxTabsPage, {user_id: this._user_id});
  }

  goto_otest(){
    this.app.getRootNav().push(OtestAssignmentListPage, {user_id: this._user_id});
  }

  goto_bank_account(){
    this.app.getRootNav().push(BankAccountPage, {user_id: this._user_id});
  }

  goto_commission(){
    this.app.getRootNav().push(TutorCommissionPage, {user_id: this._user_id});
  }

  goto_running_course(){
    this.app.getRootNav().push(RunningCoursePage, {user_id: this._user_id, role: this._role});
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

  goto_change_language(){
    this.app.getRootNav().push(RunningCoursePage, {user_id: this._user_id, role: this._role});
  }

}
