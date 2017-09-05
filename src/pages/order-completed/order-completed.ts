import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, App } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { OrderStudentDetailPage } from '../order-student-detail/order-student-detail';
import { InvoicePaymentPage } from '../invoice-payment/invoice-payment';

@Component({
  selector: 'page-order-completed',
  templateUrl: 'order-completed.html'
})
export class OrderCompletedPage {
	_student_id: string;
	_response_data: any;
  _class_invoice: string = "";
  _translate: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    private app: App,
    private nativeStorage: NativeStorage
  ) {
    this._translate = translate;
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
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.get('http://tutordoors.com/api/order/student_accepted_request/lang/'+this._translate.currentLang+'/sid/'+this._student_id).map(res => res.json()).subscribe(data => {
          loading.dismiss();
          this._response_data = data;
          if(data.invoice_id == ""){
            this._class_invoice = "hide";
          }
      }, error => {
        loading.dismiss();
          let toast = this.toastCtrl.create({
            message: error,
            duration: 3000
          });
          toast.present();
      });
  }

  detail(order_id){
  	this.app.getRootNav().push(OrderStudentDetailPage, {order_id: order_id});
  }

  invoice(inv_id){
    this.app.getRootNav().push(InvoicePaymentPage, {invoice_id: inv_id});
  }
}
