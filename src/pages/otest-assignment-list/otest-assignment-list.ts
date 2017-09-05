import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { OtestPreviewPage } from '../otest-preview/otest-preview';

@Component({
  selector: 'page-otest-assignment-list',
  templateUrl: 'otest-assignment-list.html'
})
export class OtestAssignmentListPage {
	_user_id: string;
	_test: any;
	_is_allowed: string = "";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController
  ) {
  	this._user_id = this.navParams.get('user_id');
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    this._test = [];
    this.http.get('http://tutordoors.com/api/otest/assignment_list/lang/'+translate.currentLang+'/tid/'+this._user_id).map(res => res.json()).subscribe(data => {
    	this._test = data;
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
    console.log('ionViewDidLoad OtestAssignmentListPage');
  }

  preview(_assignment_id, _test_id){
    this.navCtrl.push(OtestPreviewPage, {
      user_id: this._user_id, 
      assignment_id: _assignment_id, 
      test_id: _test_id
    });
  }

}
