import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-tutor-opened-city-add',
  templateUrl: 'tutor-opened-city-add.html'
})
export class TutorOpenedCityAddPage {
	_translate: any;
	_user_id: string;
	_province: Array<{id: string, name: string}>;
	_city: Array<{id: string, name: string}>;
	_selected: any;

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

  	this._translate = translate;
  	this._user_id = this.navParams.get('tutor_id');
  	this._selected = [];

  	// get province data for server
    this.http.get('http://tutordoors.com/api/location/province').map(res => res.json()).subscribe(data => {
      this._province = [];
      
      for(var i=0, len=data.length; i<len; i++)
        this._province.push({
            id: data[i].province_id,
            name: data[i].province_name
          });
      loading.dismiss();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorOpenedCityAddPage');
  }

  generate_city(prov_id_){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.get('http://tutordoors.com/api/location/city/id/'+prov_id_).map(res => res.json()).subscribe(data => {
        this._city = [];
        
        for(var i=0, len=data.length; i<len; i++)
          this._city.push({
              id: data[i].city_id,
              name: data[i].city_name
            });
        loading.dismiss();
    });
  }

  do_submit(){
    let loading = this.loadingCtrl.create({
      content: 'Submitting data'
    });

    loading.present();
    
    var cities = '';
    this._selected.map(function(item){
      for(var i=0, len=item.length; i<len; i++){
        cities = cities+item[i]+'-';
      }
      cities = cities.slice(0, -1);
    });
    // console.log(cities);

    var _uri_string = 'http://tutordoors.com/api/tutor/add_area/';
    
    let body = new FormData();
    body.append('tid', this._user_id);
    body.append('area', cities);
    body.append('lang', this._translate.currentLang);

    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
      loading.dismiss();
      let toast = this.toastCtrl.create({
        message: data.message,
        duration: 3000
      });
      toast.present();
      this.navCtrl.pop();
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
