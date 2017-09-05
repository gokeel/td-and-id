import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-tutor-opened-course-add',
  templateUrl: 'tutor-opened-course-add.html'
})
export class TutorOpenedCourseAddPage {
	_translate: any;
	_user_id: string;
	_program: Array<{id: string, name: string}>;
	_course: Array<{id: string, name: string}>;

	_program_data: any;
	_selected: any;
  _select_days: any;
  _select_session: any;
  _days: Array<{id: string, day: string}>;
  _sessions: Array<{id: string, sess: string}>;
  _logged_user: any;
  _lang_hour: string;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController
  ) {
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

  	this._translate = translate;
  	this._user_id = this.navParams.get('tutor_id');

  	translate.get('Common.hours').subscribe(
      value => {
        this._lang_hour = value;
      }
    )

  	this._days = [
            {id: '01', day: 'Common.day_01'},
            {id: '02', day: 'Common.day_02'},
            {id: '03', day: 'Common.day_03'},
            {id: '04', day: 'Common.day_04'},
            {id: '05', day: 'Common.day_05'},
            {id: '06', day: 'Common.day_06'},
            {id: '07', day: 'Common.day_07'}
          ];

    this._sessions = [
            {id: '1.5', sess: '1.5 '+this._lang_hour},
            {id: '2', sess: '2 '+this._lang_hour},
            {id: '2.5', sess: '2.5 '+this._lang_hour},
            {id: '3', sess: '3 '+this._lang_hour}
          ];

  	this._selected = [];

  	// get location data for server
    this.http.get('http://tutordoors.com/api/course').map(res => res.json()).subscribe(data => {
        this._program_data = data;
        loading.dismiss();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorOpenedCourseAddPage');
  }

  do_submit(){
    let loading = this.loadingCtrl.create({
      content: 'Submitting data'
    });

    loading.present();
    
    var days = '';
    if(this._select_days != ""){
    	for(var i=0, len=this._select_days.length; i<len; i++){
	      days = days + this._select_days[i] + '-';
	    }
	    days = days.slice(0, -1);	
    }

    var sessions = '';
    if(this._select_session != ""){
    	for(var i=0, len=this._select_session.length; i<len; i++){
	      sessions = sessions + this._select_session[i] + '-';
	    }
	    sessions = sessions.slice(0, -1);
    }

    let course = '';
    this._selected.map(function(item){
      for(var i=0, len=item.length; i<len; i++){
        course += item[i]+'-';
      }
    });
    course = course.slice(0, -1);

    var _uri_string = 'http://tutordoors.com/api/tutor/add_program/';
    
    let body = new FormData();
    body.append('tid', this._user_id);
    body.append('day', days);
    body.append('sess', sessions);
    body.append('prog', course);
    body.append('lang', this._translate.currentLang);

    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
      // console.log(data);
      loading.dismiss();
      let toast = this.toastCtrl.create({
        message: data.message,
        duration: 3000
      });
      toast.present();
      this.navCtrl.pop();
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

}
