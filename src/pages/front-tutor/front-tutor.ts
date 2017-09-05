import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-front-tutor',
  templateUrl: 'front-tutor.html'
})
export class FrontTutorPage {
	_user_id: string;
	_is_verified: boolean;
	_stat: string;
	_status_icon: string;
	_color_icon: string;
  _translate: any;

  constructor(
  	public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    private nativeStorage: NativeStorage
  	) {
    this._translate = translate;
  	let env = this;
    this.nativeStorage.getItem('logged_user')
      .then( function (data) {
        env._user_id = data.id;
        env.get_profile();
      }, function (error) {
        let toast = env.toastCtrl.create({
          message: 'No logged user',
          duration: 3000
        });
        toast.present();
      });
  }

  get_profile() {
    this.http.get('http://tutordoors.com/api/tutor/dashboard/lang/'+this._translate.currentLang+'/tid/'+this._user_id).map(res => res.json()).subscribe(data => {
          // this._is_verified = data.is_verified;
          if(data.is_verified == "1"){
            this._status_icon = "checkmark-circle";
            this._color_icon = "blue";
          }
          else if(data.is_verified == "0"){
            this._status_icon = "close";
            this._color_icon = "red";
          }
          this._stat = data.statistic;
        });
    
  }

}
