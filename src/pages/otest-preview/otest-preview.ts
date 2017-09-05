import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { OtestRunningPage } from '../otest-running/otest-running';

@Component({
  selector: 'page-otest-preview',
  templateUrl: 'otest-preview.html'
})
export class OtestPreviewPage {
	_user_id: string;
	_assignment_id: string;
	_test_id: string;
	_test_name: string;
	_duration: string;
	_objectives: string;
	_hint: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController
  ) {
  	this._user_id = this.navParams.get('user_id');
  	this._assignment_id = this.navParams.get('assignment_id');
  	this._test_id = this.navParams.get('test_id');

  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    
    this.http.get('http://tutordoors.com/api/otest/preview/lang/'+translate.currentLang+'/userid/'+this._user_id+'/assid/'+this._assignment_id+'/testid/'+this._test_id).map(res => res.json()).subscribe(data => {
    			this._test_name = data.test_data.test_name;
    			this._duration = data.test_data.time_in_minutes;
    			this._objectives = data.test_data.objectives;
    			this._hint = data.test_data.how_to;
          loading.dismiss();
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
    console.log('ionViewDidLoad OtestPreviewPage');
  }

  start(){
    this.navCtrl.push(OtestRunningPage, {
      user_id: this._user_id, 
      assignment_id: this._assignment_id, 
      test_id: this._test_id
    });
  }

}
