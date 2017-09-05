import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { SignUpPage } from '../sign-up/sign-up';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
    
  }

  open_login(as_role){
  	this.navCtrl.push(LoginPage);
  }

  open_signup(as_role){
  	this.navCtrl.push(SignUpPage,{role: as_role});
  }

}
