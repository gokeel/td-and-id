import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController, ToastController, App } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { SearchTutorPage } from '../search-tutor/search-tutor';
import { SearchTutorByProgramPage } from '../search-tutor-by-program/search-tutor-by-program';
import { SearchTutorAllProgramPage } from '../search-tutor-all-program/search-tutor-all-program';

@Component({
  selector: 'page-front-student',
  templateUrl: 'front-student.html'
})
export class FrontStudentPage {
	_logged_user: any;
  _user_id: string;
  _provinces: any;
	_province: Array<{id: string, name: string}>;
	_cities: any;
	_city: Array<{id: string, name: string}>;
	_programs: any;
	_program: Array<{id: string, name: string}>;
	_courses: any;
	_course: Array<{id: string, name: string}>;
	_sel_province: string;
  _sel_city: string;
  _sel_program: string;
  _sel_program_id: string;
  _sel_course: string;
  _translate: any;
  _data_programs_count: any;
  _sel_program_count: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    private app: App
  ) {

  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    // get location data from server
    this.http.get('http://tutordoors.com/api/location').map(res => res.json()).subscribe(data => {
        this._provinces = data;
    });

    // get course data from server
    this.http.get('http://tutordoors.com/api/course').map(res => res.json()).subscribe(data => {
        this._programs = data;
    });

    // get program data from server
    this.http.get('http://tutordoors.com/api/course/search_by_program').map(res => res.json()).subscribe(data => {
        this._data_programs_count = data;
        loading.dismiss();
    });

    

  	// // get province data
  	// this.http.get('http://tutordoors.com/api/location/province').map(res => res.json()).subscribe(data => {
  	// 		loading.dismiss();
   //      this._provinces = data;
   //      this._province = [];
        
		 //    for(var i=0, len=this._provinces.length; i<len; i++)
		 //    	this._province.push({
			//       	id: this._provinces[i].province_id,
			//       	name: this._provinces[i].province_name
			//       });
   //  });

   //  // get program data
  	// this.http.get('http://tutordoors.com/api/course/program').map(res => res.json()).subscribe(data => {
   //      this._programs = data;
   //      this._program = [];
        
		 //    for(var i=0, len=this._programs.length; i<len; i++)
		 //    	this._program.push({
			//       	id: this._programs[i].id,
			//       	name: this._programs[i].category
			//       });
   //  });

    // get term condition text
    this._translate = translate;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FrontStudentPage');
  }

  generate_city(index){
    this._cities = this._provinces[index].city;
   //  let loading = this.loadingCtrl.create({
   //    content: 'Please wait...'
   //  });

   //  loading.present();

  	// this.http.get('http://tutordoors.com/api/location/city/id/'+prov_id_).map(res => res.json()).subscribe(data => {
   //      this._cities = data;
   //      this._city = [];
        
		 //    for(var i=0, len=this._cities.length; i<len; i++)
		 //    	this._city.push({
			//       	id: this._cities[i].city_id,
			//       	name: this._cities[i].city_name
			//       });
   //      loading.dismiss();
   //  });
  }

  generate_course(id_){
    let param_array = id_.split("-");
    this._courses = this._programs[param_array[0]].course;
    this._sel_program_id = param_array[1];
   //  let loading = this.loadingCtrl.create({
   //    content: 'Please wait...'
   //  });

   //  loading.present();

  	// this.http.get('http://tutordoors.com/api/course/course/id/'+prog_id_).map(res => res.json()).subscribe(data => {
   //      this._courses = data;
   //      this._course = [];
        
		 //    for(var i=0, len=this._courses.length; i<len; i++)
		 //    	this._course.push({
			//       	id: this._courses[i].id,
			//       	name: this._courses[i].category
			//       });
   //      loading.dismiss();
   //  });
  }

  do_submit(){
  	if(this._sel_program===undefined || this._sel_course==undefined || this._sel_city==undefined){
  		let toast = this.toastCtrl.create({
	      message: 'Check your input',
	      duration: 3000,
	      position: 'bottom'
	    });
	    toast.present();
  	}
  	else{
  		let loading = this.loadingCtrl.create({
	      content: 'Please wait...'
	    });

	    loading.present();

  		// get program data
	  	this.http.get('http://tutordoors.com/api/tutor/search/lang/'+this._translate.currentLang+'/city/'+this._sel_city+'/program/'+this._sel_program_id+'/course/'+this._sel_course).map(res => res.json()).subscribe(data => {
	        loading.dismiss();
	        if(data.status=="error"){
	        	let toast = this.toastCtrl.create({
				      message: data.message,
				      duration: 3000,
				      position: 'middle'
				    });
				    toast.present();
			    }
			    else if(data.status=="OK"){
			    	this.app.getRootNav().push(SearchTutorPage, {
			    			user_id: this._user_id,
			    			tutors: data.tutors,
			    			program: data.program,
			    			course: data.course,
			    			location: data.location
			    			});
			    }
	    });
  	}
  }

  search_program(){
    if(this._sel_program_count===undefined){
      let toast = this.toastCtrl.create({
        message: 'Check your input',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
    else{
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      // get program data
      this.http.get('http://tutordoors.com/api/tutor/search_program/lang/'+this._translate.currentLang+'/prog/'+this._sel_program_count).map(res => res.json()).subscribe(data => {
          loading.dismiss();
          if(data.status=="error"){
            let toast = this.toastCtrl.create({
              message: data.message,
              duration: 3000,
              position: 'middle'
            });
            toast.present();
          }
          else if(data.status=="OK"){
            console.log('opo');
            if(this._sel_program_count == "all")
              this.app.getRootNav().push(SearchTutorAllProgramPage, {
                user_id: this._user_id,
                tutors: data.tutors,
                title: data.title
              });
            else
              this.app.getRootNav().push(SearchTutorByProgramPage, {
                  user_id: this._user_id,
                  tutors: data.tutors,
                  title: data.title
                });
          }
      });
    }
  }

}
