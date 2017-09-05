import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-notif-detail',
  templateUrl: 'notif-detail.html'
})
export class NotifDetailPage {
	_data: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this._data = this.navParams.get('param');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotifDetailPage');
  }

}
