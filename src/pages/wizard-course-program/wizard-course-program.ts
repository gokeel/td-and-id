import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

import { WizardPersonalTutorPage } from '../wizard-personal-tutor/wizard-personal-tutor';

@Component({
  selector: 'page-wizard-course-program',
  templateUrl: 'wizard-course-program.html'
})
export class WizardCourseProgramPage {
	_program_data: any;
	_selected: any;
  _select_days: any;
  _select_session: any;
  _user_id: any;
  _days: Array<{id: string, day: string}>;
  _sessions: Array<{id: string, sess: string, unit: string}>;
  _logged_user: any;
  _lang_hour: string;
  _translate: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    public translateService: TranslateService,
    private nativeStorage: NativeStorage
  ) {

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this._translate = translate;

    // loading nativestorage
    let env = this;
    this.nativeStorage.getItem('logged_user')
        .then( function (data) {
          env._logged_user = data;          
        }, function (error) {
          let toast = env.toastCtrl.create({
            message: 'No logged user',
            duration: 3000
          });
          toast.present();
        });     

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
            {id: '1.5', sess: '1.5', unit: "Common.hours"},
            {id: '2', sess: '2', unit: "Common.hours"},
            {id: '2.5', sess: '2.5', unit: "Common.hours"},
            {id: '3', sess: '3', unit: "Common.hours"}
          ];

    this._selected = [];

    // get course data from server
    this.http.get('http://tutordoors.com/api/course').map(res => res.json()).subscribe(data => {
        this._program_data = data;
        loading.dismiss();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WizardCourseProgramPage');
  }

  do_submit(){
    let loading = this.loadingCtrl.create({
      content: 'Submitting data'
    });

    loading.present();
    
    var days = '';
    if(this._select_days != undefined){
      for(var i=0, len=this._select_days.length; i<len; i++){
        days = days + this._select_days[i] + '-';
      }
      days = days.slice(0, -1);
    }

    var sessions = '';
    if(this._select_session != undefined){
      for(var i=0, len=this._select_session.length; i<len; i++){
        sessions = sessions + this._select_session[i] + '-';
      }
      sessions = sessions.slice(0, -1);
    }

    var course = '';
    this._selected.map(function(item){
      for(var i=0, len=item.length; i<len; i++){
        course = course+item[i]+'-';
      }
    });
    course = course.slice(0, -1);
    loading.dismiss();
    var _uri_string = 'http://tutordoors.com/api/tutor/add_program/';
    
    let body = new FormData();
    body.append('tid', this._logged_user.id);
    body.append('day', days);
    body.append('sess', sessions);
    body.append('prog', course);
    body.append('lang', this._translate.currentLang);

    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
      // console.log(data);
      loading.dismiss();
      if(data.status == "OK"){
        this.nativeStorage.setItem('logged_user', 
          { id: this._logged_user.id, 
            email: this._logged_user.email,
            fn: this._logged_user.fn,
            ln: this._logged_user.ln,
            role: this._logged_user.role,
            verified: this._logged_user.verified,
            checkpoint_page: 'wizard-personal-tutor'
          })
          .then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
          );
        
        this.navCtrl.push(WizardPersonalTutorPage);
      }
      else if(data.status == "error"){
        let toast = this.toastCtrl.create({
          message: data.message,
          duration: 3000
        });
        toast.present();
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

}
