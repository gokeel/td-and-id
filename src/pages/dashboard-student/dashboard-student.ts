import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Push, PushToken } from '@ionic/cloud-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

import { FrontStudentPage } from '../front-student/front-student';
import { AccountStudentPage } from '../account-student/account-student';
import { HelpTabsPage } from '../help-tabs/help-tabs';
import { RunningCoursePage } from '../running-course/running-course';
import { MonitorOrderTabsPage } from '../monitor-order-tabs/monitor-order-tabs';

@Component({
  selector: 'page-dashboard-student',
  templateUrl: 'dashboard-student.html'
})
export class DashboardStudentPage {
  tab1Root: any = FrontStudentPage;
  tab2Root: any = MonitorOrderTabsPage;
  tab3Root: any = AccountStudentPage;
  tab4Root: any = HelpTabsPage;
  tab5Root: any = RunningCoursePage;
  _selected_tab: number;
  _user_id: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public http: Http,
    public push: Push,
    private nativeStorage: NativeStorage
  ) {
  	if(this.navParams.get('active_tab') == "")
      this._selected_tab = 0;
    else this._selected_tab = this.navParams.get('active_tab');

    this._user_id = this.navParams.get('user_id');
    this.register_push_notification();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardStudentPage');
  }

  register_push_notification(){
      this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        // store token in db
        var _uri_string = 'http://tutordoors.com/api/push/save_token/';
        let body = new FormData();
        console.log(t);
        body.append('user_id', this._user_id);
        body.append('token', t.token);
        this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
            console.log('Token stored into DB');
            // store token in native storage
            this.nativeStorage.setItem('push_token', 
            {  
              token_id: data.token_id,
              token: t.token
            })
            .then(
              () => console.log('Token\'s info stored'),
              error => console.error('Error storing token', error)
            );
          }, error => {
            // this.checkConnection();
            let toast = this.toastCtrl.create({
                message: error,
                duration: 3000
              });
              toast.present();
          });
      });

      this.push.rx.notification()
        .subscribe((msg) => {
          alert(msg.title + ': ' + msg.text);
        });
    }

}
