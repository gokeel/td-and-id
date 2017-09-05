import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, ModalController, ActionSheetController, Platform, Loading } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NativeStorage, Camera, File, Transfer, FilePath  } from 'ionic-native';

import { PopPostPage } from '../pop-post/pop-post';
import { DashboardStudentPage } from '../dashboard-student/dashboard-student';
import { DashboardTutorPage } from '../dashboard-tutor/dashboard-tutor';
import { WizardCourseProgramPage } from '../wizard-course-program/wizard-course-program';
// import { WizardAreaMengajarPage } from '../wizard-area-mengajar/wizard-area-mengajar';
import { WizardPersonalStudentPage } from '../wizard-personal-student/wizard-personal-student';

declare var cordova: any;

@Component({
  selector: 'page-signup-form2',
  templateUrl: 'signup-form2.html'
})
export class SignupForm2Page {
	_role: any;
  _title: any;
  _provinces: any;
  _province: Array<{id: string, name: string}>;
  _cities: any;
  _city: Array<{id: string, name: string}>;
  _term: any;
  _term_title: any;
  _pol: any;
  _pol_title: any;
  _uri_string: string;
  _first_name: string;
  _last_name: string;
  _email: string;
  _password: string;
  _password_repeat: string;
  _sel_province: string;
  _sel_city: string;
  _translate: any;
  _teach_area: string;
  _photo_id: string;

  lastImage: string = null;
  loading: Loading;

	constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http, 
    public modalCtrl: ModalController,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform
  ) {
		this._role = navParams.get('role');
    this._email = navParams.get('email');
    this._first_name = navParams.get('fn');
    this._last_name = navParams.get('ln');

    if(this._role=='teacher'){
      this._title = 'Login.become_tutor';
      // this._teach_area = 'Userinfo.area_for_teaching';
    }
      
    else if(this._role=='student'){
      this._title = 'Login.become_student';
      // this._teach_area = 'Userinfo.area_for_studying';
    }

    // // get province data for server
    // this.http.get('http://tutordoors.com/api/location/province').map(res => res.json()).subscribe(data => {
    //     this._provinces = data;
    //     this._province = [];
        
    //     for(var i=0, len=this._provinces.length; i<len; i++)
    //       this._province.push({
    //           id: this._provinces[i].province_id,
    //           name: this._provinces[i].province_name
    //         });
    // });

    // get term condition text
    this._translate = translate;
    if(translate.currentLang == "id")
      this._uri_string = 'http://tutordoors.com/content/feed_page_json/syarat-dan-ketentuan';
    else
      this._uri_string = 'http://tutordoors.com/content/feed_page_json/terms-and-conditions';

    this.http.get(this._uri_string).map(res => res.json()).subscribe(data => {
      this._term = data.content;
      this._term_title = data.title;
    });

    // get term condition text
    if(translate.currentLang == "id")
      this._uri_string = 'http://tutordoors.com/content/feed_page_json/kebijakan-privasi';
    else
      this._uri_string = 'http://tutordoors.com/content/feed_page_json/privacy-policy';

    this.http.get(this._uri_string).map(res => res.json()).subscribe(data => {
      this._pol = data.content;
      this._pol_title = data.title;
    });
	}

	ionViewDidLoad() {
  	console.log('ionViewDidLoad SignupForm2Page');
	}

  // generate_city(prov_id_){
  //   let loading = this.loadingCtrl.create({
  //     content: 'Please wait...'
  //   });

  //   loading.present();

  //   this.http.get('http://tutordoors.com/api/location/city/id/'+prov_id_).map(res => res.json()).subscribe(data => {
  //       this._cities = data;
  //       this._city = [];
        
  //       for(var i=0, len=this._cities.length; i<len; i++)
  //         this._city.push({
  //             id: this._cities[i].city_id,
  //             name: this._cities[i].city_name
  //           });
  //       loading.dismiss();
  //   });
  // }

  alert_term() {
    let popover = this.modalCtrl.create(PopPostPage, {
      title: this._term_title,
      content: this._term
    });
    popover.present();
  }

  alert_policy() {
    let popover = this.modalCtrl.create(PopPostPage, {
      title: this._pol_title,
      content: this._pol
    });
    popover.present();
  }

  do_signup(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    
    var _uri_string = 'http://tutordoors.com/api/user/add/';
    
    let body = new FormData();
    body.append('source', 'socmed');
    body.append('email', this._email);
    body.append('level', this._role);
    body.append('fn', this._first_name);
    body.append('ln', this._last_name);
    // body.append('province', this._sel_province);
    // body.append('city', this._sel_city);
    body.append('lang', this._translate.currentLang);
    body.append('photo_id', this._photo_id);
    body.append('source', 'android');

    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
      // console.log(data);
      loading.dismiss();
      if(data.status == "OK"){
        if(data.role=="teacher"){
          NativeStorage.setItem('logged_user', 
            { id: data.user_id, 
              email: data.email,
              fn: data.first_name,
              ln: data.last_name,
              role: data.role,
              verified: false,
              checkpoint_page: 'dashboard'
              // checkpoint_page: 'wizard-course-program'
            })
            .then(
              () => console.log('Stored item!'),
              error => console.error('Error storing item', error)
            );
          this.navCtrl.setRoot(DashboardTutorPage);
          // this.navCtrl.push(WizardAreaMengajarPage);
        }
        else if(data.role=="student"){
          NativeStorage.setItem('logged_user', 
            { id: data.user_id, 
              email: data.email,
              fn: data.first_name,
              ln: data.last_name,
              role: data.role,
              verified: false,
              checkpoint_page: 'dashboard'
              // checkpoint_page: 'wizard-personal-student'
            })
            .then(
              () => console.log('Stored item!'),
              error => console.error('Error storing item', error)
            );
          this.navCtrl.setRoot(DashboardStudentPage);
        }

        let toast = this.toastCtrl.create({
          message: 'Thank you for register!',
          duration: 5000,
          position: 'middle'
        });
        toast.present();
      }
      else if(data.status == "error"){
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
  
  store_data_session(data){
    NativeStorage.setItem('logged_user', 
      { user_id: data.user_id, 
        user_email: data.email_login,
        user_fn: data.first_name,
        user_ln: data.last_name,
        user_fullname: data.first_name+' '+data.last_name,
        user_role: data.user_level,
        user_verified: data.verified_user
      })
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
    
    if(data.user_level == 'teacher')
      this.navCtrl.setRoot(DashboardTutorPage);
    else if(data.user_level == 'student')
      this.navCtrl.setRoot(DashboardStudentPage);
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    // Get the data of an image
    Camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
        FilePath.resolveNativePath(imagePath)
        .then(filePath => {
          // aslinya var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/')+1, imagePath.lastIndexOf('?'));
          var correctPath = filePath.substr(0, imagePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          
        });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
   
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage();
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
   
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
   
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // Destination URL
    var url = "http://tutordoors.com/api/media/upload_image";
   
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
   
    // File name only
    var filename = this.lastImage;
   
    var options = {
      fileKey: "userfile",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'userfile': filename}
    };
   
    const fileTransfer = new Transfer();
   
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();
   
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll();
      this.presentToast('Succesfully uploaded.');
      var response_json = JSON.parse(data.response);
      console.log(response_json);
      // return the media id
      if(response_json.status=="OK"){
        this._photo_id = response_json.media_id;
        this.presentToast('Succesfully uploaded.');
      }
      else
        this.presentToast('Failed to store in DB.');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file. Please try again.');
    });
  }

}
