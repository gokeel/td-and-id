import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController, ActionSheetController, Platform, Loading } from 'ionic-angular';
import {TranslateService} from 'ng2-translate';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Camera, File, Transfer, FilePath  } from 'ionic-native';
import { NativeStorage } from '@ionic-native/native-storage';

declare var cordova: any;

@Component({
  selector: 'page-edit-profile-tutor',
  templateUrl: 'edit-profile-tutor.html'
})
export class EditProfileTutorPage {
	_translate: any;
	_file_url: string;
	_user_id: string;
	_sex: string;
  _religion: string;
  _birth_place: string;
  _birth_date: string;
  _address: string;
  _phone: string;
  _school_name: string;
  _about_me: string;
  _hobby: string;
  _first_name: string;
  _last_name: string;
  _photo_id: string;
  _teach_experience: string;
  _toefl: string;
  _skill: string;
  _institution: string;
  _major: string;
  _grade_score: string;
  _year_in: string;
  _year_out: string;
  _degree: string;
  _edu_id: string = '';

  lastImage: string = null;
  loading: Loading;
	
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private translate: TranslateService, 
    public http: Http, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform
  ) {
  	this._translate = translate;
  	this._user_id = this.navParams.get('user_id');

  	this.http.get('http://tutordoors.com/api/tutor/personal/lang/'+this._translate.currentLang+'/id/'+this._user_id).map(res => res.json()).subscribe(data => {
  				this._first_name = data.profile.first_name;
  				this._last_name = data.profile.last_name;
	        this._file_url = 'http://tutordoors.com/assets/uploads/'+data.profile.file_name;
	        this._sex = data.profile.sex;
	        this._religion = data.profile.religion;
	        this._birth_place = data.profile.birth_place;
	        this._birth_date = data.profile.birth_date;
	        this._address = data.profile.address_domicile;
	        this._phone = data.profile.phone_1;
	        this._school_name = data.profile.where_student_school;
	        this._about_me = data.profile.about_me;
	        this._hobby = data.profile.hobby;
	        this._teach_experience = data.profile.teach_experience;
	        this._skill = data.profile.skill;
	        this._toefl = data.profile.toefl_score;

	        this._edu_id = data.education.id;
	        this._degree = data.education.degree;
	        this._institution = data.education.institution;
	        this._major = data.education.major;
	        this._grade_score = data.education.grade_score;
	        this._year_in = data.education.date_in;
	        this._year_out = data.education.date_out;
	    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfileTutorPage');
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
      saveToPhotoAlbum: true,
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

  update_info(){
  	let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    
    var _uri_string = 'http://tutordoors.com/api/tutor/update_personal_education/';
    
    let body = new FormData();
    body.append('tid', this._user_id);
    body.append('fn', this._first_name);
    body.append('ln', this._last_name);
    body.append('photo_id', this._photo_id == undefined ? "" : this._photo_id);
    body.append('sex', this._sex);
    body.append('lang', this._translate.currentLang);
    body.append('religion', this._religion);
    body.append('birth-place', this._birth_place);
    body.append('birth-date', this._birth_date);
    body.append('address-ktp', this._address);
    body.append('address-domicile', this._address);
    body.append('phone-1', this._phone);
    body.append('phone-2', this._phone);
    body.append('about-me', this._about_me);
    body.append('teach-exp', this._teach_experience);
    body.append('skill', this._skill);
    body.append('toefl', this._toefl);
    body.append('hobby', this._hobby);
    body.append('degree', this._degree);
    body.append('institution', this._institution);
    body.append('major', this._major);
    body.append('grade', this._grade_score);
    body.append('year-in', this._year_in);
    body.append('year-out', this._year_out);
    body.append('edu-id', this._edu_id == undefined ? "" : this._edu_id);

    this.http.post(_uri_string, body).map(res => res.json()).subscribe(data => {
      // console.log(data);
      loading.dismiss();
      if(data.status == "OK"){
      	let toast = this.toastCtrl.create({
          message: 'Updated successfully',
          duration: 3000
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

}
