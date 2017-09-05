import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { OrderInprogressTutorPage } from '../order-inprogress-tutor/order-inprogress-tutor';
import { OrderCompletedTutorPage } from '../order-completed-tutor/order-completed-tutor';

@Component({
  selector: 'page-monitor-order-tutor-tabs',
  templateUrl: 'monitor-order-tutor-tabs.html'
})
export class MonitorOrderTutorTabsPage {
	tab1Root: any = OrderInprogressTutorPage;
  tab2Root: any = OrderCompletedTutorPage;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MonitorOrderTutorTabsPage');
  }

}
