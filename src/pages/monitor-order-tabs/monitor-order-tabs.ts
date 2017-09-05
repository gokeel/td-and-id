import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { OrderInprogressPage } from '../order-inprogress/order-inprogress';
import { OrderCompletedPage } from '../order-completed/order-completed';

@Component({
  selector: 'page-monitor-order-tabs',
  templateUrl: 'monitor-order-tabs.html'
})
export class MonitorOrderTabsPage {
	tab1Root: any = OrderInprogressPage;
  tab2Root: any = OrderCompletedPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MonitorOrderTabsPage');
  }

}
