import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { PaymentConfirmationPage } from '../payment-confirmation/payment-confirmation';

@Component({
  selector: 'page-invoice-payment',
  templateUrl: 'invoice-payment.html'
})
export class InvoicePaymentPage {
	_inv_id: string;
	_total: string;
	_due: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController
  ) {
  	this._inv_id = this.navParams.get('invoice_id');

  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.get('http://tutordoors.com/api/invoice/info/lang/'+translate.currentLang+'/inv/'+this._inv_id).map(res => res.json()).subscribe(data => {
          this._total = data.total;
          this._due = data.due_date;
          loading.dismiss();
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
    console.log('ionViewDidLoad InvoicePaymentPage');
  }

  confirm(){
  	this.navCtrl.push(PaymentConfirmationPage, {invoice_id: this._inv_id, bank_id: "bca"});
  }

}
