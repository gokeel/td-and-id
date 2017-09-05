import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';

/*
  Generated class for the PopPost page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-pop-post',
  templateUrl: 'pop-post.html'
})
export class PopPostPage {
	_title: string;
	_content: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private translate: TranslateService) {
  	this._title = this.navParams.get('title');
  	this._content = this.navParams.get('content');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopPostPage');
  }

}
