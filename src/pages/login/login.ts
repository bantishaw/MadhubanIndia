import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { Api } from '../../providers/providers';
import { User } from '../../providers/providers';
import { Http, Headers } from '@angular/http';
import { MainPage } from '../pages';
import {SignupPage} from '../signup/signup';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  existingUser: any;
  email: string;
  password: string;
  showSpinner: any = false;
  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public apiProvider: Api,
    public http: Http,
    public loadingCtrl: LoadingController) { }

  doLogin() {
    this.showSpinner = true;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var userObject = {
      email: this.email,
      password: this.password
    }
    if (!userObject.email) {
      this.toastMessage("Email address cannot be empty")
    } else if (!userObject.password) {
      this.toastMessage("Password cannot be empty")
    } else {
      this.apiProvider.userLogin(userObject).then((data) => {
        this.existingUser = data;
        let loading = this.loadingCtrl.create({
          spinner: 'crescent',
          cssClass: "wrapper"
        });
        if (this.existingUser.response === 'success') {
          loading.present();
          setTimeout(() => {
            loading.dismiss();
            this.navCtrl.push(MainPage);
          }, 500);
        } else {
          this.toastMessage(this.existingUser.data)
        }
      })
    }
  }

  newUserRegister() {
    this.navCtrl.push(SignupPage);
  }

  forgotPassword() {
    this.navCtrl.push('ForgtoPasswordPage')
  }

  toastMessage(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'middle',
      cssClass: 'showToast'
    });
    toast.present();
  }
}