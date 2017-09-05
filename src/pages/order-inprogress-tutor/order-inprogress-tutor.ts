import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, App } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { OrderTutorDetailPage } from '../order-tutor-detail/order-tutor-detail';

@Component({
  selector: 'page-order-inprogress-tutor',
  templateUrl: 'order-inprogress-tutor.html'
})
export class OrderInprogressTutorPage {
	_tutor_id: string;
	_response_data: any;
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

  	// get student ID
	  	let env = this;
	    this.nativeStorage.getItem('logged_user')
	      .then( function (user_data) {
	        env._tutor_id = user_data.id;
			    env.http.get('http://tutordoors.com/api/order/tutor_open_request/lang/'+translate.currentLang+'/tid/'+env._tutor_id).map(res => res.json()).subscribe(data => {
			  			env._response_data = data;
			  			env.get_data();
			    }, error => {
			      let toast = env.toastCtrl.create({
			          message: error,
			          duration: 3000
			        });
			      toast.present();
			    });
	      }, function (error) {
	      	let toast = env.toastCtrl.create({
	          message: 'No logged user',
	          duration: 3000
	        });
	        toast.present();
	      });
  }

  get_data(){
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    // this._tutor_id = '110213486';
    this.http.get('http://tutordoors.com/api/order/tutor_open_request/lang/'+this._translate.currentLang+'/tid/'+this._tutor_id).map(res => res.json()).subscribe(data => {
  			loading.dismiss();
  			this._response_data = data;
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
  	this.app.getRootNav().push(OrderTutorDetailPage, {order_id: order_id});
  }

  refresh(){
  	this.get_data();
  }

}
