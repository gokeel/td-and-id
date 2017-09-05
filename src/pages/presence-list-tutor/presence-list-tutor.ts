import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-presence-list-tutor',
  templateUrl: 'presence-list-tutor.html'
})
export class PresenceListTutorPage {
	_translate: any;
	_items: any;
	_enroll_id: string;
	_course: string;
	_teacher: string;
	_student: string;
	_study_date: string;
	_start_time: string;
	_end_time: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController
  ) {
  	this._enroll_id = this.navParams.get('enroll_id');
  	this._translate = translate;

  	this.get_data();
  }

  get_data(){
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.get('http://tutordoors.com/api/course/presence_list/lang/'+this._translate.currentLang+'/eid/'+this._enroll_id).map(res => res.json()).subscribe(data => {
          loading.dismiss();
          this._items = data.presence;
          this._course = data.course_name;
          this._teacher = data.teacher_name;
          this._student = data.student_name;
      }, error => {
        loading.dismiss();
          let toast = this.toastCtrl.create({
            message: error,
            duration: 3000
          });
          toast.present();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PresenceListTutorPage');
  }

  do_submit(){
  	var _uri_string = 'http://tutordoors.com/api/course/add_absence/';
    let body = new FormData();
    body.append('eid', this._enroll_id);
    body.append('teach-date', this._study_date);
    body.append('start-time', this._start_time);
    body.append('end-time', this._end_time);
    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
        if(data.status=="200")
        	this.get_data();
        else{
        	let toast = this.toastCtrl.create({
	            message: data.message,
	            duration: 3000
	          });
	          toast.present();
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
