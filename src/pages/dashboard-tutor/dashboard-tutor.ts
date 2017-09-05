import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Push, PushToken } from '@ionic/cloud-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage } from '@ionic-native/native-storage';

import { FrontTutorPage } from '../front-tutor/front-tutor';
import { AccountTutorPage } from '../account-tutor/account-tutor';
import { HelpTabsPage } from '../help-tabs/help-tabs';
import { RunningCoursePage } from '../running-course/running-course';
import { MonitorOrderTutorTabsPage } from '../monitor-order-tutor-tabs/monitor-order-tutor-tabs';

@Component({
  selector: 'page-dashboard-tutor',
  templateUrl: 'dashboard-tutor.html'
})
export class DashboardTutorPage {
  tab1Root: any = FrontTutorPage;
  tab2Root: any = MonitorOrderTutorTabsPage;
  tab3Root: any = AccountTutorPage;
  tab4Root: any = HelpTabsPage;
  tab5Root: any = RunningCoursePage;
  _selected_tab: number;
  _user_id: string;
  _role: string;

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

    let env = this;
    this.nativeStorage.getItem('logged_user')
        .then( function (data) {
          env._user_id = data.id;
          env._role = data.role;
          env.register_push_notification();
        }, function (error) {
          let toast = env.toastCtrl.create({
            message: 'No logged user',
            duration: 3000
          });
          toast.present();
        });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardTutorPage');
  }

  register_push_notification(){
      this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        // store token in db
        var _uri_string = 'http://tutordoors.com/api/push/save_token/';
        let body = new FormData();
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
