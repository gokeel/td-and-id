import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController} from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-mail-compose',
  templateUrl: 'mail-compose.html'
})
export class MailComposePage {
	_translate: any;
	_users: any;
	_usersInitial: any;
	_user_id: string;
	_searchQuery: string = '';
	_sel_user_id: string = '';
	_logged_user: any;
	_subject: string;
	_message: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    private nativeStorage: NativeStorage
  ) {
  	this.initializeItems();
  }

  initializeItems(){
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    // get program data from server
    this.http.get('http://tutordoors.com/api/user/all/').map(res => res.json()).subscribe(data => {
        this._users = data;
        this._usersInitial = data;
        loading.dismiss();
    });
  }

  ionViewDidLoad() {
    let env = this;
    this.nativeStorage.getItem('logged_user')
        .then( function (data) {
          env._logged_user = data;
          env._user_id = data.id;
        }, function (error) {
          let toast = env.toastCtrl.create({
            message: 'No logged user',
            duration: 3000
          });
          toast.present();
        });
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this._users = this._usersInitial;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this._users = this._users.filter((item) => {
      	let item_str = item.user_id + " | " + item.first_name + " " + item.last_name;
        return (item_str.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  set_id(user_id){
  	this._sel_user_id = user_id;
  	let val = this._sel_user_id;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
	  	this._users = this._users.filter((item) => {
	      	let item_str = item.user_id;
	        return (item_str.toLowerCase().indexOf(val.toLowerCase()) > -1);
	      })
	  }
  }

  do_send(){
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    
    var _uri_string = 'http://tutordoors.com/api/messaging/send_mail/';
    
    let body = new FormData();
    body.append('sender_id', this._user_id);
    body.append('destination_id', this._sel_user_id);
    body.append('content', this._message);
    body.append('subject', this._subject);

    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
      // console.log(data);
      loading.dismiss();
      if(data.status == "OK"){
        let toast = this.toastCtrl.create({
          message: 'Sent!',
          duration: 3000
        });
        this._message = '';
        this._subject = '';
        toast.present();
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
