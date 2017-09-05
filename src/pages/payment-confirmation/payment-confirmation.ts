import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-payment-confirmation',
  templateUrl: 'payment-confirmation.html'
})
export class PaymentConfirmationPage {
	_inv_id: string;
	_bank_id: string;
	_name: string;
	_nominal: string;
	_transfer_date: string;
	_notes: string;
	_user_id: string = '';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    private nativeStorage: NativeStorage
  ) {
  	this._inv_id = this.navParams.get('invoice_id');
  	this._bank_id = this.navParams.get('bank_id');

  	let env = this;
    this.nativeStorage.getItem('logged_user')
      .then( function (user_data) {
        env._user_id = user_data.id;
      }, function (error) {
      	let toast = env.toastCtrl.create({
          message: 'No logged user',
          duration: 3000
        });
        toast.present();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentConfirmationPage');
  }

  do_submit(){
  	if(this._name==undefined || this._nominal==undefined || this._transfer_date==undefined){
  		let toast = this.toastCtrl.create({
          message: 'Fill the mandatory input!',
          duration: 5000
        });
        
      toast.present();
  	}
  	else{
  		let loading = this.loadingCtrl.create({
	      content: 'Submitting...'
	    });

	    loading.present();
	    
	    var _uri_string = 'http://tutordoors.com/api/invoice/submit_payment_conf/';
	    
	    let body = new FormData();
	    body.append('invoice-id', this._inv_id);
	    body.append('bank', this._bank_id);
	    body.append('name', this._name);
	    body.append('transfer-date', this._transfer_date);
	    body.append('note', (this._notes==undefined ? '' : this._notes));
	    body.append('total', this._nominal);
	    body.append('user_id', this._user_id);

	    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
	      // console.log(data);
	      loading.dismiss();
	      if(data.status == "200"){
	        let toast = this.toastCtrl.create({
	          message: data.message,
	          duration: 3000
	        });
	        toast.present();
	        this.navCtrl.pop();
	      }
	      else if(data.status == "204"){
	        let toast = this.toastCtrl.create({
	          message: data.message,
	          duration: 3000
	        });
	        toast.present();
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
  }

}
