import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { TutorOpenedCourseAddPage } from '../tutor-opened-course-add/tutor-opened-course-add';

@Component({
  selector: 'page-tutor-opened-course',
  templateUrl: 'tutor-opened-course.html'
})
export class TutorOpenedCoursePage {
	_translate: any;
	_user_id: string;
	_course: Array<{id: string, program: string, course: string, days: string, session: string, icon_status: string, icon_delete: string, class_status: string, class_delete: string, delete_message: string}>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController
  ) {
  	this._translate = translate;
  	this._user_id = this.navParams.get('tutor_id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorOpenedCoursePage');
  }

  ionViewWillEnter(){
  	this.get_data();
  }

  get_data(){
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

	  this.http.get('http://tutordoors.com/api/tutor/opened_course/lang/'+this._translate.currentLang+'/tid/'+this._user_id).map(res => res.json()).subscribe(data => {
	  		this._course = [];

  			for(var i=0, len=data.length; i<len; i++){
  				let i_status: string;
  				let i_delete: string;
  				let color: string;
  				let color_delete: string;
  				let delete_msg: string = '';
  				if(data[i].verified == "0"){
  					i_status = 'close-circle';
  					i_delete = 'remove-circle';
  					color = 'off';
  				}
  				else{
  					i_status = 'checkmark-circle-outline';
  					color = 'on';
  					color_delete = 'off';
  					if(data[i].delete_request == "0"){
  						i_delete = 'remove-circle';
  					}
  					else{
  						i_delete = 'alert';
  						delete_msg = 'In verification';
  					}
  				}
  				
		    	this._course.push({
			      	id: data[i].id,
			      	program: data[i].program,
			      	course: data[i].course,
			      	days: data[i].days,
			      	session: data[i].sessions,
			      	icon_status: i_status,
			      	icon_delete: i_delete,
			      	class_status: color,
			      	class_delete: color_delete,
			      	delete_message: delete_msg
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

  doRefresh(refresher) {
    this.get_data();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  refresh(){
  	this.get_data();
  }

  add(){
  	this.navCtrl.push(TutorOpenedCourseAddPage, {tutor_id: this._user_id});
  }

  delete_item(id, course){
  	let course_id_ = id;
  	let confirm = this.alertCtrl.create({
      title: 'Confirmation?',
      message: 'Are you sure to delete '+course+'?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancelled');
          }
        },
        {
          text: 'OK',
          handler: () => {
            let loading = this.loadingCtrl.create({
				      content: 'Please wait...'
				    });

				    loading.present();

					  this.http.get('http://tutordoors.com/api/tutor/request_delete/part/course/id/'+course_id_+'/tid/'+this._user_id).map(res => res.json()).subscribe(data => {
				  			loading.dismiss();
				  			let toast = this.toastCtrl.create({
				          message: 'Admin will verify your request.',
				          duration: 3000
				        });
				        toast.present();
				        // reload data
				        this.get_data();
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
      ]
    });
    confirm.present();
  }
}
