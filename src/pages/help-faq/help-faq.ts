import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-help-faq',
  templateUrl: 'help-faq.html'
})
export class HelpFaqPage {
	_faq: Array<{title: string, details: string, icon: string, showDetails: boolean}> = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController
  ) {
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

  	this.http.get('http://tutordoors.com/api/content/faq/lang/'+translate.currentLang).map(res => res.json()).subscribe(data => {
        this._faq = [];
        
		    for(var i=0, len=data.length; i<len; i++){
		    	var content = data[i].content;
		    	var cleanText = content.replace(/<\/?[^>]+(>|$)/g, "");
		    	this._faq.push({
			      	title: data[i].title,
			      	details: cleanText,
			      	icon: 'ios-add-circle-outline',
							showDetails: false
			      });
		    }
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
    console.log('ionViewDidLoad HelpFaqPage');
  }

  toggleDetails(data) {
    if (data.showDetails) {
        data.showDetails = false;
        data.icon = 'ios-add-circle-outline';
    } else {
        data.showDetails = true;
        data.icon = 'ios-remove-circle-outline';
    }
	}

}
