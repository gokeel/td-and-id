import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-help-tell-us',
  templateUrl: 'help-tell-us.html'
})
export class HelpTellUsPage {
  _tell_cat: string;
	_tell_content: string;
  _translate: any;
  _title: string;
  _alert: string;
  _logged_user: any;

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
    this._translate = translate;
  }

  ionViewDidLoad() {
    let env = this;
    this.nativeStorage.getItem('logged_user')
        .then( function (data) {
          env._logged_user = data;
        }, function (error) {
          let toast = env.toastCtrl.create({
            message: 'No logged user',
            duration: 3000
          });
          toast.present();
        });
  }

  showAlert() {
    // this._translate.get('Common.hours').subscribe(
    //   value => {
    //     this._lang_hour = value;
    //   }
    // )

    if(this._translate.currentLang == "id"){
      let alert = this.alertCtrl.create({
        title: 'Hubungi Kami',
        message: "<i>Jam kerja:</i> 8:00 - 16:00<br><br>"
                + "<i>Telepon:</i> +6221-57932642<br><br>"
                + "<i>Email:</i> customercare@tutordoors.com<br><br>"
                + "<i>Alamat:</i> STC Senayan lt. 2 no. 109 Jl. Asia Afrika Senayan, Central Jakarta, 10270",
        buttons: ['OK']
      });
      alert.present();
    }
    else if(this._translate.currentLang == "en"){
      let alert = this.alertCtrl.create({
        title: 'Contact Us',
        message: "<i>Working hour:</i> 8:00 - 16:00<br><br>"
                + "<i>Phone:</i> +6221-57932642<br><br>"
                + "<i>Email:</i> customercare@tutordoors.com<br><br>"
                + "<i>Address:</i> STC Senayan lt. 2 no. 109 Jl. Asia Afrika Senayan, Central Jakarta, 10270",
        buttons: ['OK']
      });
      alert.present();
    }
    
  }

  do_submit(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    
    var _uri_string = 'http://tutordoors.com/api/user/submit_question/';
    
    let body = new FormData();
    body.append('user_id', this._logged_user.id);
    body.append('message', this._tell_content);
    body.append('category', this._tell_cat);

    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
      // console.log(data);
      loading.dismiss();
      if(data.status == "OK"){
        let toast = this.toastCtrl.create({
          message: 'Thanks for submitting, we will follow up your message!',
          duration: 3000
        });
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
