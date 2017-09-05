import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController, ActionSheetController, Platform, Loading } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage, Camera, File, Transfer, FilePath } from 'ionic-native';

import { DashboardTutorPage } from '../dashboard-tutor/dashboard-tutor';

declare var cordova: any;

@Component({
  selector: 'page-wizard-education-tutor',
  templateUrl: 'wizard-education-tutor.html'
})
export class WizardEducationTutorPage {
	_langs: Array<{value: string, name: string, checked: string}>;
	_default_lang: any;
  _translate: any;
  _logged_user: any;
  _degree: string;
  _university: string;
  _major: string;
  _grade: string;
  _year_in: string;
  _year_out: string;
  _certificate_photo_id: string;
  _transcript_photo_id: string;

  certificateImage: string = null;
  transcriptImage: string = null;
  lastImage: string = null;
  loading: Loading;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform
  ) {

    this._langs = [
		    {value: "en", name: "English", checked: translate.currentLang=="en" ? "true" : "false"},
		    {value: "id", name: "Bahasa Indonesia", checked: translate.currentLang=="id" ? "true" : "false"}
		  ];
		this._default_lang = translate.currentLang;

    this._translate = translate;

    // loading nativestorage
    let env = this;
    NativeStorage.getItem('logged_user')
        .then( function (data) {
          env._logged_user = data;          
        }, function (error) {
          let toast = env.toastCtrl.create({
            message: 'No logged user',
            duration: 3000
          });
          toast.present();
        });     
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WizardEducationTutorPage');
  }

  change_lang($lang_id){
  	this.translate.setDefaultLang($lang_id);
  	this.translate.use($lang_id);
	}

  do_submit(){
    let loading = this.loadingCtrl.create({
      content: 'Submitting data'
    });

    loading.present();

    var _uri_string = 'http://tutordoors.com/api/tutor/add_education/';
    
    let body = new FormData();
    body.append('tid', this._logged_user.id);
    body.append('degree', this._degree == undefined ? "" : this._degree);
    body.append('institution', this._university == undefined ? "" : this._university);
    body.append('major', this._major == undefined ? "" : this._major);
    body.append('year_in', this._year_in == undefined ? "" : this._year_in);
    body.append('year_out', this._year_out == undefined ? "" : this._year_out);
    body.append('grade_score', this._grade == undefined ? "" : this._grade);
    body.append('lang', this._translate.currentLang);

    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
      // console.log(data);
      loading.dismiss();
      if(data.status == "OK"){
        NativeStorage.setItem('logged_user', 
          { id: this._logged_user.id, 
            email: this._logged_user.email,
            fn: this._logged_user.fn,
            ln: this._logged_user.ln,
            role: this._logged_user.role,
            verified: this._logged_user.verified,
            checkpoint_page: 'dashboard-tutor'
          })
          .then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
          );

        let toast = this.toastCtrl.create({
          message: 'Thank you for register!',
          duration: 5000,
          position: 'middle'
        });
        toast.present();
        
        this.navCtrl.push(DashboardTutorPage);
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

    loading.dismiss();
  }
}
