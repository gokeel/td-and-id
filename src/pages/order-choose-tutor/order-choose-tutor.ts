import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { OrderFormPage } from '../order-form/order-form';

@Component({
  selector: 'page-order-choose-tutor',
  templateUrl: 'order-choose-tutor.html'
})
export class OrderChooseTutorPage {
	_tutor_id: string;
	_tutor: any;
	_thumb: string;
	_fullname: string;
	_about_me: string;
	_sex: string;
	_age: string;
	_education: any;
	_teach_experience: any;
	_competence: any;
	_certificate: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController
  ) {
  	this._tutor_id = this.navParams.get('tutor');

  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.get('http://tutordoors.com/api/tutor/profile/lang/'+translate.currentLang+'/tid/'+this._tutor_id).map(res => res.json()).subscribe(data => {
  			loading.dismiss();
  			// console.log(data);
        this._thumb = data.image_thumb;
        this._fullname = data.user_info.first_name+' '+data.user_info.last_name;
        // this._about_me = data.user_info.about_me;
        this._sex = 'Userinfo.sex_'+data.user_info.sex;
        this._age = data.user_age;
        this._education = data.education;
        this._competence = data.open_course;
        if(data.user_info.teach_experience==null)
        	this._teach_experience = '-';
        else
        	this._teach_experience = data.user_info.teach_experience;

        if(data.user_info.certification==null)
        	this._certificate = '-';
        else
        	this._certificate = data.user_info.certification;
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
    console.log('ionViewDidLoad OrderChooseTutorPage');
  }

  choose(){
  	this.navCtrl.push(OrderFormPage, {tutor_id: this._tutor_id});
  }

}
