import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-bank-account',
  templateUrl: 'bank-account.html'
})
export class BankAccountPage {
	_user_id: string;
	_name: string;
	_number: string;
	_account: string;
	_branch: string;
	_city: string;

  constructor(
  	public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController
  	) {
  	this._user_id = this.navParams.get('user_id');

  	this.http.get('http://tutordoors.com/api/tutor/bank/lang/'+translate.currentLang+'/id/'+this._user_id).map(res => res.json()).subscribe(data => {
  				this._name = data.bank_name;
  				this._number = data.bank_account_number;
  				this._account = data.bank_holder_name;
  				this._branch = data.bank_branch;
  				this._city = data.bank_city;
	    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BankAccountPage');
  }

  do_save(){
    if(this._name == undefined || this._number == undefined || this._account == undefined){
      let toast = this.toastCtrl.create({
          message: 'Check your input!',
          duration: 3000
        });
        
        toast.present();
    }
    else{
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();
      
      var _uri_string = 'http://tutordoors.com/api/tutor/set_bank_account/';
      
      let body = new FormData();
      body.append('tid', this._user_id);
      body.append('bank-name', this._name);
      body.append('number', this._number);
      body.append('holder-name', this._account);
      body.append('branch', this._branch);
      body.append('city', this._city);

      this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
        // console.log(data);
        loading.dismiss();
        if(data.status == "200"){
          let toast = this.toastCtrl.create({
            message: 'Saved!',
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
    }

  }

}
