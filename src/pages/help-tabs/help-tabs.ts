import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HelpTellUsPage } from '../help-tell-us/help-tell-us';
import { HelpFaqPage } from '../help-faq/help-faq';

@Component({
  selector: 'page-help-tabs',
  templateUrl: 'help-tabs.html'
})
export class HelpTabsPage {
	tab1Root: any = HelpTellUsPage;
  tab2Root: any = HelpFaqPage;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpTabsPage');
  }

}
