import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

import { WizardCourseProgramPage } from '../wizard-course-program/wizard-course-program';

@Component({
  selector: 'page-wizard-area-mengajar',
  templateUrl: 'wizard-area-mengajar.html'
})
export class WizardAreaMengajarPage {
  _location_data: any;
  _selected: any;
  _user_id: any;
  _logged_user: any;
  _translate: any;

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

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this._translate = translate;

    let env = this;
    this.nativeStorage.getItem('logged_user')
        .then( function (data) {
          env._logged_user = data;
          env._user_id = data.id;
        }, function (error) {
          let toast = env.toastCtrl.create({
            message: 'No logged user',
            duration: 3000
          });
          toast.present();
        });

    this._selected = [];

    // get location data from server
    this.http.get('http://tutordoors.com/api/location').map(res => res.json()).subscribe(data => {
        this._location_data = data;
        loading.dismiss();
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WizardAreaMengajarPage');
  }

  do_submit(){
    let loading = this.loadingCtrl.create({
      content: 'Submitting data'
    });

    loading.present();
    
    var cities = '';
    this._selected.map(function(item){
      for(var i=0, len=item.length; i<len; i++){
        cities = cities+item[i]+'-';
      }
      cities = cities.slice(0, -1);
    });
    // console.log(cities);

    var _uri_string = 'http://tutordoors.com/api/tutor/add_area/';
    
    let body = new FormData();
    body.append('tid', this._user_id);
    body.append('area', cities);
    body.append('lang', this._translate.currentLang);

    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
      // console.log(this._logged_user);
      loading.dismiss();
      if(data.status == "OK"){
        this.nativeStorage.setItem('logged_user', 
          { id: this._logged_user.id, 
            email: this._logged_user.email,
            fn: this._logged_user.fn,
            ln: this._logged_user.ln,
            role: this._logged_user.role,
            verified: this._logged_user.verified,
            checkpoint_page: 'wizard-course-program'
          })
          .then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
          );

        this.navCtrl.push(WizardCourseProgramPage);
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
