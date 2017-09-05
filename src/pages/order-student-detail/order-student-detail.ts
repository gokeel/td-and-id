import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-order-student-detail',
  templateUrl: 'order-student-detail.html'
})
export class OrderStudentDetailPage {
	_order_id: string;
	_program: string;
	_course_name: string;
	_tutor_name: string;
	_address: string;
	_city: string;
	_province: string;
	_days: string;
	_start_date: string;
	_salary: string;
	_class: string;
	_session: string;
	_price_module_study: string;
	_price_module_tryout: string;
	_total_price: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController
  ) {
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this._order_id = this.navParams.get('order_id');
    this.http.get('http://tutordoors.com/api/course/request_detail/lang/'+translate.currentLang+'/oid/'+this._order_id).map(res => res.json()).subscribe(data => {
  			loading.dismiss();
  			this._program = data[0].program;
  			this._course_name = data[0].course;
  			this._tutor_name = data[0].tutor_fn+' '+data[0].tutor_ln;
  			this._address = data[0].address;
  			this._city = data[0].city_name;
  			this._province = data[0].province_name;
  			this._days = data[0].days;
  			this._start_date = data[0].start_date;
  			this._salary = data[0].salary;
  			this._class = data[0].class;
  			this._session = data[0].session;
  			this._price_module_study = data[0].module_price;
  			this._price_module_tryout = data[0].tryout_price;
  			this._total_price = data[0].grand_total;
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
    console.log('ionViewDidLoad OrderStudentDetailPage');
  }

}
