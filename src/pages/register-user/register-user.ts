import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the RegisterUser page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register-user',
  templateUrl: 'register-user.html'
})
export class RegisterUserPage {
	name: any;
	provinces: any;
	province: Array<{id: string, name: string}>;
	cities: any;
	city: Array<{id: string, name: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
  	// this.name = navParams.get('role');
  	this.name = "Ocky Harliansyah";
  	this.http.get('http://tutordoors.com/dev20/location/get_provinces').map(res => res.json()).subscribe(data => {
        this.provinces = data.provinces;
        this.province = [];
        
		    for(var i=0, len=this.provinces.length; i<len; i++)
		    	this.province.push({
			      	id: this.provinces[i].id,
			      	name: this.provinces[i].name
			      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterUserPage');
  }

  generate_city(prov_id){
  	this.http.get('http://tutordoors.com/dev20/location/get_cities_by_province/'+prov_id).map(res => res.json()).subscribe(data => {
        this.cities = data.cities;
        this.city = [];
        
		    for(var i=0, len=this.cities.length; i<len; i++)
		    	this.city.push({
			      	id: this.cities[i].id,
			      	name: this.cities[i].name
			      });
    });
  }

}
