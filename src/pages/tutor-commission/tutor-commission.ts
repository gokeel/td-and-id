import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-tutor-commission',
  templateUrl: 'tutor-commission.html'
})
export class TutorCommissionPage {
	_user_id: string;
	_comms: any;

  constructor(
  	public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController
  	) {
  	this._user_id = this.navParams.get('user_id');

  	this.http.get('http://tutordoors.com/api/tutor/commission/lang/'+translate.currentLang+'/tid/'+this._user_id).map(res => res.json()).subscribe(data => {
  				this._comms = data;
	    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorCommissionPage');
  }

}
