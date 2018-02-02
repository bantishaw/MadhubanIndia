import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { Api } from '../../providers/providers';
import { User } from '../../providers/providers';
import { Http, Headers } from '@angular/http';
import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  existingUser: any;
  email: string;
  password: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public apiProvider: Api,
    public http: Http) { }

  doLogin() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var userObject = {
      email: this.email,
      password: this.password
    }
    this.apiProvider.userLogin(userObject).then((data) => {
      this.existingUser = data;
      if (this.existingUser.response === 'success') {
        this.navCtrl.push(MainPage);
      } else {
        let toast = this.toastCtrl.create({
          message: this.existingUser.data,
          duration: 3000,
          position: 'middle',
          cssClass: 'showToast'
        });
        toast.present();
      }
    })
  }

  newUserRegister() {
    this.navCtrl.push('SignupPage');
  }

  forgotPassword() {
    this.navCtrl.push('ForgtoPasswordPage')
  }
}