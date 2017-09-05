import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

import { DashboardStudentPage } from '../dashboard-student/dashboard-student';

@Component({
  selector: 'page-wizard-personal-student',
  templateUrl: 'wizard-personal-student.html'
})
export class WizardPersonalStudentPage {
	_langs: Array<{value: string, name: string, checked: string}>;
	_default_lang: any;
  _translate: any;
  _logged_user: any;
  _sex: string;
  _religion: string;
  _birth_place: string;
  _birth_date: string;
  _address: string;
  _phone: string;
  _school_name: string;
  _about_me: string;
  _hobby: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    private nativeStorage: NativeStorage
  ) {

    this._langs = [
		    {value: "en", name: "English", checked: translate.currentLang=="en" ? "true" : "false"},
		    {value: "id", name: "Bahasa Indonesia", checked: translate.currentLang=="id" ? "true" : "false"}
		  ];
		this._default_lang = translate.currentLang;

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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WizardPersonalStudentPage');
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

    var _uri_string = 'http://tutordoors.com/api/student/update_personal/';
    
    let body = new FormData();
    body.append('sid', this._logged_user.id);
    body.append('sex', this._sex == undefined ? "" : this._sex);
    body.append('religion', this._religion == undefined ? "" : this._religion);
    body.append('birth-place', this._birth_place == undefined ? "" : this._birth_place);
    body.append('birth-date', this._birth_date == undefined ? "" : this._birth_date);
    body.append('school-name', this._school_name == undefined ? "" : this._school_name);
    body.append('address-ktp', this._address == undefined ? "" : this._address);
    body.append('address-domicile', this._address == undefined ? "" : this._address);
    body.append('phone-1', this._phone == undefined ? "" : this._phone);
    body.append('about-me', this._about_me == undefined ? "" : this._about_me);
    body.append('hobby', this._hobby == undefined ? "" : this._hobby);
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
            checkpoint_page: 'dashboard-student'
          })
          .then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
          );

        let toast = this.toastCtrl.create({
          message: 'Thank you for register.',
          duration: 5000,
          position: 'middle'
        });
        toast.present();
        
        this.navCtrl.push(DashboardStudentPage);
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
