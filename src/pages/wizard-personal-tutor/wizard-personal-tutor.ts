import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

import { WizardEducationTutorPage } from '../wizard-education-tutor/wizard-education-tutor';

@Component({
  selector: 'page-wizard-personal-tutor',
  templateUrl: 'wizard-personal-tutor.html'
})
export class WizardPersonalTutorPage {
	_langs: Array<{value: string, name: string, checked: string}>;
	_default_lang: any;
  _translate: any;
  _logged_user: any;
  _ktp: string;
  _sex: string;
  _religion: string;
  _birth_place: string;
  _birth_date: string;
  _address: string;
  _phone: string;
  _teach_exp: string;
  _skill: string;
  _toefl: string;
  _ielts: string;

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

    this._birth_date = "2017-01-01";

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
    console.log('ionViewDidLoad WizardPersonalTutorPage');
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

    var _uri_string = 'http://tutordoors.com/api/tutor/update_personal/';
    
    let body = new FormData();
    body.append('tid', this._logged_user.id);
    body.append('ktp', this._ktp == undefined ? "" : this._ktp);
    body.append('sex', this._sex == undefined ? "" : this._sex);
    body.append('religion', this._religion == undefined ? "" : this._religion);
    body.append('birth-place', this._birth_place == undefined ? "" : this._birth_place);
    body.append('birth-date', this._birth_date == undefined ? "" : this._birth_date);
    body.append('address-ktp', this._address == undefined ? "" : this._address);
    body.append('address-domicile', this._address == undefined ? "" : this._address);
    body.append('phone-1', this._phone == undefined ? "" : this._phone);
    body.append('teach-experience', this._teach_exp==undefined ? "" : this._teach_exp);
    body.append('toefl', this._toefl == undefined ? "" : this._toefl);
    body.append('ielts', this._ielts == undefined ? "" : this._ielts);
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
            checkpoint_page: 'wizard-education-tutor'
          })
          .then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
          );
        
        this.navCtrl.push(WizardEducationTutorPage);
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
