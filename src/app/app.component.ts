import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from 'ionic-native';
import {TranslateService} from 'ng2-translate'; // https://github.com/ocombe/ng2-translate

import { HomePage } from '../pages/home/home';
import { DashboardStudentPage } from '../pages/dashboard-student/dashboard-student';
import { DashboardTutorPage } from '../pages/dashboard-tutor/dashboard-tutor';
import { WizardAreaMengajarPage } from '../pages/wizard-area-mengajar/wizard-area-mengajar';
import { WizardCourseProgramPage } from '../pages/wizard-course-program/wizard-course-program';
import { WizardPersonalTutorPage } from '../pages/wizard-personal-tutor/wizard-personal-tutor';
import { WizardEducationTutorPage } from '../pages/wizard-education-tutor/wizard-education-tutor';
import { WizardPersonalStudentPage } from '../pages/wizard-personal-student/wizard-personal-student';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  rootPage:any = HomePage;
  pages: Array<{title: string, component: any}>;
  tutor_pages: Array<{title: string, component: any}>;

  constructor(
    platform: Platform, 
    private translate: TranslateService, 
    public menu: MenuController, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen
    ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      // setTimeout(() => {
      //   Splashscreen.hide();
      // }, 100);
      // Splashscreen.hide();

      // set our app's pages
      this.pages = [
        { title: 'Hello Ionic', component: DashboardTutorPage },
        { title: 'My First List', component: DashboardStudentPage }
      ];

      this.tutor_pages = [
        { title: 'Dashboard', component: DashboardTutorPage },
        { title: 'Profile', component: DashboardStudentPage }
      ];

      translate.addLangs(["en", "id"]);
      translate.setDefaultLang('en');

      translate.use('en');
    
      splashScreen.hide();

      let env = this;
      // NativeStorage.clear();
      NativeStorage.getItem('logged_user')
        .then( function (data) {
          // console.log(data);
          if(data.role=="teacher"){
            if(data.checkpoint_page == "wizard-area-mengajar")
              env.nav.push(WizardAreaMengajarPage);
            else if(data.checkpoint_page == "wizard-course-program")
              env.nav.push(WizardCourseProgramPage);
            else if(data.checkpoint_page == "wizard-personal-tutor")
              env.nav.push(WizardPersonalTutorPage);
            else if(data.checkpoint_page == "wizard-education-tutor")
              env.nav.push(WizardEducationTutorPage);
            else
              env.nav.setRoot(DashboardTutorPage, {user_id: data.id});
          }
          else if(data.role=="student"){
            if(data.checkpoint_page == "wizard-personal-student")
              env.nav.push(WizardPersonalStudentPage);
            else
              env.nav.setRoot(DashboardStudentPage, {user_id: data.id});
          }
        }, function (error) {
          env.nav.push(HomePage);
        });
    }); 
  }
}

