import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';

import { DashboardTutorPage } from '../dashboard-tutor/dashboard-tutor';

@Component({
  selector: 'page-otest-result',
  templateUrl: 'otest-result.html'
})
export class OtestResultPage {
	_result_data: any;
	_assignment_id: string;
	_result: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private translate: TranslateService) {
  	this._result_data = this.navParams.get('result');
  	this._assignment_id = this._result_data.assignment_id;
  	this._result = this._result_data.result;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtestResultPage');
  }

  back_root(){
  	this.navCtrl.setRoot(DashboardTutorPage, {active_tab: 3});
  }

}
