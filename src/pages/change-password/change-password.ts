import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Api } from '../../providers/providers';
import { Http, Headers } from '@angular/http';
import { App } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  databaseEmail: any;
  oldDatabasePassword: any;
  currentPassword: any;
  newPassword: any;
  reTypeNewPassword: any;
  passwordMatchCorrectly: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: Api,
    public http: Http, private alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public appCtrl: App) { }

  ionViewDidLoad() {
    this.databaseEmail = this.apiProvider.settingsInformation.settingsInformation[0].email;
    this.oldDatabasePassword = this.apiProvider.settingsInformation.settingsInformation[0].password;
  }
  saveNewPassword() {
    let settingsObject = {
      email: this.databaseEmail,
      password: this.newPassword
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (!this.currentPassword || !this.newPassword || !this.reTypeNewPassword) {
      let alert = this.alertCtrl.create({
        title: 'Alert',
        subTitle: 'Please fill all fields',
        buttons: ['OK']
      });
      alert.present();
    } else if (this.oldDatabasePassword !== this.currentPassword) {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'You have entered your old Madhuban India password incorrectly.',
        buttons: ['OK']
      });
      alert.present();
    } else if (this.newPassword !== this.reTypeNewPassword) {
      let alert = this.alertCtrl.create({
        title: 'Alert',
        subTitle: 'The new passwords do not match. Please try again.',
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.apiProvider.saveNewSettingsPassword(settingsObject).then((data) => {
        this.passwordMatchCorrectly = data;
        let loading = this.loadingCtrl.create({
          spinner: 'crescent',
          cssClass: "wrapper"
        });
        if (this.passwordMatchCorrectly.response === "success") {
          loading.present();
          setTimeout(() => {
            loading.dismiss();
            this.appCtrl.getRootNav().push('LoginPage')
          }, 500);
        }
      })
    }
  }



}
