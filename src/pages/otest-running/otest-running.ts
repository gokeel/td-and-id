import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Slides } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { OtestResultPage } from '../otest-result/otest-result';

@Component({
  selector: 'page-otest-running',
  templateUrl: 'otest-running.html'
})
export class OtestRunningPage {
	_user_id: string;
	_assignment_id: string;
	_test_id: string;
	_test_name: string;
	_questions: any;
	_answers: any;
	_translate: any;
	_taker_id: string;
  _timeLeft: number;

   constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController
  ) {
   	this._user_id = this.navParams.get('user_id');
  	this._assignment_id = this.navParams.get('assignment_id');
  	this._test_id = this.navParams.get('test_id');
  	this._translate = translate;

  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    this._answers = {};
    
    this.http.get('http://tutordoors.com/api/otest/start/lang/'+translate.currentLang+'/userid/'+this._user_id+'/assid/'+this._assignment_id+'/testid/'+this._test_id).map(res => res.json()).subscribe(data => {
    			if(data.status=="200"){
            this._test_name = data.test_data.test_name;
          
            this._questions = data.questions;
            this._taker_id = data.taker_id;
            this._timeLeft = parseInt(data.test_data.time_in_minutes) * 60;

            var timer = setInterval(() => {
              if(this._timeLeft != 0) {
                this._timeLeft -=  1;
              } 
              else {
                clearInterval(timer);
                this.submit_answers();
              }
            }, 1000);
          }
          else if(data.status=="204"){
            let toast = this.toastCtrl.create({
              message: data.message,
              duration: 3000
            });
            toast.present();
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
    console.log('ionViewDidLoad OtestRunningPage');
  }

  submit_answers(){
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    
    var _uri_string = 'http://tutordoors.com/api/otest/submit_answer/';
    
    let body = new FormData();
    body.append('lang', this._translate.currentLang);
    body.append('taker_id', this._taker_id);
    // fetching answer object
    for(var key in this._answers){
    	body.append('answer-'+key, this._answers[key]);
    }

    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
      // console.log(data);
      loading.dismiss();
      if(data.status == "200"){
        let toast = this.toastCtrl.create({
          message: 'Answers have been submitted!',
          duration: 3000
        });
        toast.present();
        this.navCtrl.push(OtestResultPage, {result: data});
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
