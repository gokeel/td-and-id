import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
// import 'rxjs/Rx'; // karena ada error property map does not exist

import { DashboardStudentPage } from '../dashboard-student/dashboard-student';

@Component({
  selector: 'page-order-review',
  templateUrl: 'order-review.html'
})
export class OrderReviewPage {
	_student_id: string;
	_tutor_id: string;
	_tutor_name: string;
	_course: any;
	_program: string;
	_course_name: string;
	_city: any;
	_province_string: string;
	_city_string: string;
	_class: number;
	_session: number;
	_modul_array: any;
	_salary: number;
	_response_data: any;
	_price_module_study: number = 0;
	_price_module_tryout: number = 0;
	_total_price: number = 0;
	_check_module: any;
	_check_tryout: any;
	_address: string;
	_start_date: string;
	_start_date_string: string;
	_days: string;
	_days_string: string;
	_include_module_study: boolean;
	_include_module_tryout: boolean;
	_translate: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
  	this._translate = translate;
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

  	this._student_id = this.navParams.get('student_id');
  	this._tutor_id = this.navParams.get('tutor_id');
  	this._tutor_name = this.navParams.get('tutor_name');
  	this._course = this.navParams.get('course');
  	this._address = this.navParams.get('address');
  	this._city = this.navParams.get('city');
  	this._days = this.navParams.get('day');
  	this._start_date = this.navParams.get('start_date');
  	this._class = this.navParams.get('class');
  	this._session = this.navParams.get('session');
  	this._total_price = this.navParams.get('total_price');
  	this._salary = this.navParams.get('salary');
  	this._include_module_study = this.navParams.get('include_module');
  	this._include_module_tryout = this.navParams.get('include_tryout');
  	if(this._include_module_study)
  		this._price_module_study = this.navParams.get('module_price');
  	if(this._include_module_tryout)
  		this._price_module_tryout = this.navParams.get('tryout_price');

  	this.http.get('http://tutordoors.com/api/order/review/lang/'+translate.currentLang+'/co/'+this._course+'/ci/'+this._city+'/sd/'+this._start_date+'/day/'+encodeURIComponent(this._days)).map(res => res.json()).subscribe(data => {
  			loading.dismiss();
  			this._program = data.program;
  			this._course_name = data.course_name;
  			this._province_string = data.province_name;
  			this._city_string = data.city_name;
  			this._days_string = data.days;
  			this._start_date_string = data.start_date;
    }, error => {
      loading.dismiss();
        let toast = this.toastCtrl.create({
          message: error,
          duration: 3000
        });
        toast.present();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderReviewPage');
  }

  checkout(){
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    
    var _uri_string = 'http://tutordoors.com/api/order/save/';
    
    let body = new FormData();
    body.append('lang', this._translate.currentLang);
    body.append('student_id', this._student_id);
    body.append('tutor_id', this._tutor_id);
    body.append('address', this._address);
    body.append('start_date', this._start_date);
    body.append('course_id', this._course);
    body.append('inc_module', this._include_module_study==true ? "true" : "false");
    body.append('inc_tryout', this._include_module_tryout==true ? "true" : "false");
    body.append('city_id', this._city);
    body.append('days', this._days);
    body.append('session', this._session.toString());
    body.append('class', this._class.toString());

    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
      loading.dismiss();
		  if(data.status == "OK"){
		    let confirm = this.alertCtrl.create({
  		    //title: 'Use this lightsaber?',
  		    message: 'Your order has been submitted. The selected tutor will call you soon.',
  		    buttons: [
  		      {
  		        text: 'Close',
  		        handler: () => {
  		          this.navCtrl.setRoot(DashboardStudentPage, {active_tab: 1});
  		        },
  		        cssClass: 'btn-close'
  		      }
  		    ]
  		    });
		    confirm.present();
      }
      else if(data.status == "error"){
        let toast = this.toastCtrl.create({
          message: data.message,
          duration: 3000
        });
        toast.present();
      }
    }, error => {
      // this.checkConnection();
      loading.dismiss();
      let toast = this.toastCtrl.create({
        message: error,
        duration: 3000
      });
      toast.present();
    });
  }
}
