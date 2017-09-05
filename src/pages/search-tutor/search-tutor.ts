import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { OrderChooseTutorPage } from '../order-choose-tutor/order-choose-tutor';

@Component({
  selector: 'page-search-tutor',
  templateUrl: 'search-tutor.html'
})
export class SearchTutorPage {
	_tutors: any;
	_user_id: string;
	_program: string;
	_course: string;
	_location: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this._tutors = this.navParams.get('tutors');
  	this._user_id = this.navParams.get('user_id');
  	this._program = this.navParams.get('program');
  	this._course = this.navParams.get('course');
  	this._location = this.navParams.get('location');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchTutorPage');
  }

  tutor_detail(tutor_id){
  	this.navCtrl.push(OrderChooseTutorPage, {tutor: tutor_id});
  }
}
