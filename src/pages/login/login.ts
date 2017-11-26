import { Component } from '@angular/core';
console.log("hi")
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html' 
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  // email : string = " admin@madhubanIndia.com";
  // password : string = "admin"
  email : string ;
  password : string;
  account: { email: string, password: string } = {
    email: 'admin', 
    password: 'admin'
  };

  // Our translated text strings
  private loginErrorString: string;
  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  

  // Attempt to login in through our User service
  // doLogin() {
  //   console.log(this.account.email)
  //   this.user.login(this.account).subscribe((resp) => {
  //     console.log("d")
  //     this.navCtrl.push(MainPage);
  //     console.log()
  //   }, (err) => {
  //     console.log("2")
  //     // this.navCtrl.push(MainPage);
  //     // Unable to log in
  //     let toast = this.toastCtrl.create({
  //       message: this.loginErrorString,
  //       duration: 3000,
  //       position: 'top'
  //     });
  //     toast.present();
  //   });
  // } 

  doLogin() {
    if ((this.account.email == this.email)&&(this.account.password == this.password)) {
      this.navCtrl.push(MainPage);
    } else {
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top',
        cssClass : 'showToast'
      });
      toast.present();
    }
  }

  newUserRegister() {
    this.navCtrl.push('SignupPage');
  }

  forgotPassword(){
    this.navCtrl.push('ForgtoPasswordPage')
  }
}