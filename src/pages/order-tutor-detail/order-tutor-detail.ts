import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-order-tutor-detail',
  templateUrl: 'order-tutor-detail.html'
})
export class OrderTutorDetailPage {
	_order_id: string;
	_course_id: string;
	_program: string;
	_course_name: string;
	_student_name: string;
	_address: string;
	_city: string;
	_province: string;
	_days: string;
	_start_date: string;
	_class: string;
	_session: string;
	_modules: string = '';
	_status: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this._order_id = this.navParams.get('order_id');
    this.http.get('http://tutordoors.com/api/course/request_detail/lang/'+translate.currentLang+'/oid/'+this._order_id).map(res => res.json()).subscribe(data => {
  			loading.dismiss();
  			this._course_id = data[0].course_id;
  			this._program = data[0].program;
  			this._course_name = data[0].course;
  			this._student_name = data[0].student_fn+' '+data[0].student_ln;
  			this._address = data[0].address;
  			this._city = data[0].city_name;
  			this._province = data[0].province_name;
  			this._days = data[0].days;
  			this._start_date = data[0].start_date;
  			this._class = data[0].class;
  			this._session = data[0].session;
  			this._modules = data[0].modules;
  			this._status = data[0].order_course_status;
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
    console.log('ionViewDidLoad OrderTutorDetailPage');
  }

  confirm(order_id, course_id){
  	let prompt = this.alertCtrl.create({
      title: 'Confirmation',
      message: "Are you sure to confirm?",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            let loading = this.loadingCtrl.create({
				      content: 'Please wait...'
				    });

				    loading.present();
				    var _uri_string = 'http://tutordoors.com/api/order/teacher_confirm_order_course/';
				    
				    let body = new FormData();
				    body.append('order-id', order_id);
				    body.append('course-id', course_id);

				    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
				      // console.log(data);
				      loading.dismiss();
				      if(data.status == "200"){
				        let toast = this.toastCtrl.create({
				          message: 'Done!',
				          duration: 3000
				        });
				        toast.present();
				      }
				      else if(data.status == "204"){
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
				    this.navCtrl.pop();
          }
        }
      ]
    });
    prompt.present();
  }

  reject(order_id, course_id){
  	let prompt = this.alertCtrl.create({
      title: 'Reject',
      message: "Please tell the reason",
      inputs: [
        {
          name: 'reason',
          placeholder: 'Reason'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            let loading = this.loadingCtrl.create({
				      content: 'Please wait...'
				    });

				    loading.present();
				    var _uri_string = 'http://tutordoors.com/api/order/teacher_reject_course_order/';
				    
				    let body = new FormData();
				    body.append('order-id', order_id);
				    body.append('course-id', course_id);
				    body.append('reason', data.reason);

				    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
				      // console.log(data);
				      loading.dismiss();
				      if(data.status == "200"){
				        let toast = this.toastCtrl.create({
				          message: 'Done!',
				          duration: 3000
				        });
				        toast.present();
				      }
				      else if(data.status == "204"){
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
				    this.navCtrl.pop();
          }
        }
      ]
    });
    prompt.present();
  }

}
