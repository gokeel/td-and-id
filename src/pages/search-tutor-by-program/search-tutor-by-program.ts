import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { OrderChooseTutorPage } from '../order-choose-tutor/order-choose-tutor';

@Component({
  selector: 'page-search-tutor-by-program',
  templateUrl: 'search-tutor-by-program.html'
})
export class SearchTutorByProgramPage {
	_tutors: any;
	_user_id: string;
	_title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this._tutors = this.navParams.get('tutors');
  	this._user_id = this.navParams.get('user_id');
  	this._title = this.navParams.get('title');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchTutorByProgramPage');
  }

  tutor_detail(tutor_id){
  	this.navCtrl.push(OrderChooseTutorPage, {tutor: tutor_id});
  }

}
