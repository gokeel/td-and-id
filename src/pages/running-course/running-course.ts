import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, App } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { PresenceListTutorPage } from '../presence-list-tutor/presence-list-tutor';
import { PresenceListStudentPage } from '../presence-list-student/presence-list-student';

@Component({
  selector: 'page-running-course',
  templateUrl: 'running-course.html'
})
export class RunningCoursePage {
	_user_id: string;
	_role: string;
	_response_data: any;
	_translate: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    private app: App,
    private nativeStorage: NativeStorage
  ) {
  	this._translate = translate;
  	
  	let env = this;
    this.nativeStorage.getItem('logged_user')
        .then( function (data) {
          env._user_id = data.id;
          env._role = data.role;
    			env.get_data();
        }, function (error) {
          let toast = env.toastCtrl.create({
            message: 'No logged user',
            duration: 3000
          });
          toast.present();
        });
    this.get_data();
  }

  get_data() {
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.get('http://tutordoors.com/api/course/running_course/lang/'+this._translate.currentLang+'/uid/'+this._user_id+'/role/'+this._role).map(res => res.json()).subscribe(data => {
          loading.dismiss();
          this._response_data = data;
      }, error => {
        loading.dismiss();
          let toast = this.toastCtrl.create({
            message: error,
            duration: 3000
          });
          toast.present();
      });
  }

  goto_presence(enroll_id){
  	if(this._role=="teacher" || this._role=="tutor")
  		this.app.getRootNav().push(PresenceListTutorPage, {enroll_id: enroll_id});
  	if(this._role=="student")
  		this.app.getRootNav().push(PresenceListStudentPage, {enroll_id: enroll_id});
  }

  complete(enroll_id){

  }

}
