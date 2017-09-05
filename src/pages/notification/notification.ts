import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController} from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { NotifDetailPage } from '../notif-detail/notif-detail';

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {
	_translate: any;
	_items: any;
	_user_id: string;
	_limit_start: number;
	_limit_row: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController
  ) {
  	this._user_id = this.navParams.get('user_id');
  	this._translate = translate;
  	this._limit_start = 0;
  	this._limit_row = 10;
  }

  ionViewDidLoad() {
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    // get program data from server
    this.http.get('http://tutordoors.com/api/messaging/notification/lang/en/user_id/'+this._user_id+'/start/'+this._limit_start+'/limit/'+this._limit_row).map(res => res.json()).subscribe(data => {
        this._items = data;
        this._limit_start += this._limit_row;
        loading.dismiss();
    });
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      // get program data from server
	    this.http.get('http://tutordoors.com/api/messaging/notification/lang/en/user_id/'+this._user_id+'/start/'+this._limit_start+'/limit/'+this._limit_row).map(res => res.json()).subscribe(data => {
	        if(data.length != 0){
	        	for (let i of data) {
	            this._items.push(i);
	          }
		        this._limit_start += this._limit_row;
		      }
	    });

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

  detail(data){
    this.navCtrl.push(NotifDetailPage, {param: data});
  }

}
