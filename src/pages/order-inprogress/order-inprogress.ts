import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, App } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { OrderStudentDetailPage } from '../order-student-detail/order-student-detail';

@Component({
  selector: 'page-order-inprogress',
  templateUrl: 'order-inprogress.html'
})
export class OrderInprogressPage {
	_student_id: string;
	_response_data: any;

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
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

  	// get student ID
  	let env = this;
    this.nativeStorage.getItem('logged_user')
      .then( function (user_data) {
        env._student_id = user_data.id;
		    env.http.get('http://tutordoors.com/api/order/student_open_request/lang/'+translate.currentLang+'/sid/'+env._student_id).map(res => res.json()).subscribe(data => {
		  			loading.dismiss();
		  			env._response_data = data;
		    }, error => {
		      loading.dismiss();
		        let toast = env.toastCtrl.create({
		          message: error,
		          duration: 3000
		        });
		        toast.present();
		    });
      }, function (error) {
      	loading.dismiss();

        let toast = env.toastCtrl.create({
          message: 'No logged user',
          duration: 3000
        });
        toast.present();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderInprogressPage');
  }

  detail(order_id){
  	this.app.getRootNav().push(OrderStudentDetailPage, {order_id: order_id});
  }

}
