import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController} from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-mail-outbox',
  templateUrl: 'mail-outbox.html'
})
export class MailOutboxPage {
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
    public loadingCtrl: LoadingController,
    private nativeStorage: NativeStorage
  ) {
  	this._translate = translate;
  	this._limit_start = 0;
  	this._limit_row = 10;

    let env = this;
    this.nativeStorage.getItem('logged_user')
        .then( function (data) {
          env._user_id = data.id;
          env.load_data();
        }, function (error) {
          let toast = env.toastCtrl.create({
            message: 'No logged user',
            duration: 3000
          });
          toast.present();
        });
  }

  load_data() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    // get program data from server
    this.http.get('http://tutordoors.com/api/messaging/outbox/lang/en/user_id/'+this._user_id+'/start/'+this._limit_start+'/limit/'+this._limit_row).map(res => res.json()).subscribe(data => {
        this._items = data;
        this._limit_start += this._limit_row;
        loading.dismiss();
    });
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      // get program data from server
	    this.http.get('http://tutordoors.com/api/messaging/outbox/lang/en/user_id/'+this._user_id+'/start/'+this._limit_start+'/limit/'+this._limit_row).map(res => res.json()).subscribe(data => {
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

}
