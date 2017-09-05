import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { OrderReviewPage } from '../order-review/order-review';

@Component({
  selector: 'page-order-form',
  templateUrl: 'order-form.html'
})
export class OrderFormPage {
	_student_id: string;
	_tutor_id: string;
	_tutor_name: string;
	_courses: any;
	_cities: any;
	_sel_course: any;
	_sel_city: any;
	_sel_class: number;
	_sel_days: any;
	_sel_session: number;
	_day_array: any;
	_session_array: any;
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
	_include_module_study: boolean;
	_include_module_tyout: boolean;
  _today: Date;
  _today_str: string;
  _year: number;
  _month: number;
  _mm: string;
  _day: number;
  _dd: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    private nativeStorage: NativeStorage
  ) {
  	this._tutor_id = this.navParams.get('tutor_id');
  	this._include_module_study = false;
	  this._include_module_tyout = false;
    this._today = new Date();
    this._year = this._today.getFullYear();
    this._month = this._today.getMonth() + 1;
    this._day = this._today.getDate();
    if(this._month < 10)
      this._mm = '0'+this._month.toString();
    else
      this._mm = this._month.toString();

    if(this._day < 10)
      this._dd = '0'+this._day.toString();
    else
      this._dd = this._day.toString();

    this._today_str = this._year.toString()+'-'+this._mm+'-'+this._dd;
    this._start_date = this._today_str;

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    // get student ID
  	let env = this;
    this.nativeStorage.getItem('logged_user')
        .then( function (data) {
          env._student_id = data.id;
        }, function (error) {
          let toast = env.toastCtrl.create({
            message: 'No logged user',
            duration: 3000
          });
          toast.present();
        });

    // this._total_price = 0;
    this.http.get('http://tutordoors.com/api/order/prepare_order/tid/'+this._tutor_id).map(res => res.json()).subscribe(data => {
  			loading.dismiss();
  			this._response_data = data;
  			// console.log(data);
        this._tutor_name = data.tutor_info.first_name+' '+data.tutor_info.last_name;
        this._courses = data.courses;
        this._cities = data.cities;
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
    console.log('ionViewDidLoad OrderFormPage');
  }

  changeCourse(index){
  	this._day_array = this._response_data.courses[index].days;
  	this._session_array = this._response_data.courses[index].sessions;
  	this._price_module_study = (this._response_data.courses[index].module_price == null ? 0 : this._response_data.courses[index].module_price);
  	this._price_module_tryout = (this._response_data.courses[index].tryout_price == null ? 0 : this._response_data.courses[index].tryout_price);
  	this._salary = this._response_data.courses[index].salary;

  	this._total_price = 0;
  	this._sel_days = null;
  	this._sel_session = null;
  	this._sel_class = null;
  }

  countTotalPrice(){
  	this._total_price = Math.ceil(this._salary * (this._sel_class==undefined ? 0 : this._sel_class) * (this._sel_session==undefined ? 0 : this._sel_session) / 1.5);
  	// 1.5 adalah unit satuan jam kerja tutor
  	if(this._check_module==true)
  		this._total_price = this._total_price + Number(this._price_module_study);
  	if(this._check_tryout==true)
  		this._total_price = this._total_price + Number(this._price_module_tryout);
  }

  isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
	}

  checkout(){
  	// save to storage and continue to review page
  	if(this._sel_course==null || this._sel_city==null || this.isEmpty(this._sel_days) || this._sel_class==null || this._sel_session==null || this._address==null || this._start_date==null)
  		this.toastIt("Please complete the inputs");
  	else{
			if(this._check_module==true)
	  		this._include_module_study = true;
	  	if(this._check_tryout==true)
	  		this._include_module_tyout = true;
			this.navCtrl.push(OrderReviewPage, 
					{ student_id: this._student_id,
	    			tutor_id: this._tutor_id,
	    			tutor_name: this._tutor_name,
	    			course: this._sel_course,
	    			city: this._sel_city,
	    			class: this._sel_class,
	    			day: this._sel_days,
	    			session: this._sel_session,
	    			salary: this._salary,
	    			module_price: this._price_module_study,
	    			tryout_price: this._price_module_tryout,
	    			total_price: this._total_price,
	    			address: this._address,
	    			start_date: this._start_date,
	    			include_module: this._include_module_study,
	  				include_tryout: this._include_module_tyout
	    		});
  	}
  }

  toastIt(err){
  	let toast = this.toastCtrl.create({
      message: err,
      duration: 3000
    });
    toast.present();
  }

}
