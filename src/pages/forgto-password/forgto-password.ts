import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Api } from '../../providers/providers';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-forgto-password',
  templateUrl: 'forgto-password.html',
})
export class ForgtoPasswordPage {
  forgotEmail: string;
  account: any;
  showForgotPage : boolean;
  otp : number;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiProvider: Api, public http: Http, public toastCtrl: ToastController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgtoPasswordPage');
    this.showForgotPage = true;
  }

  forgotPassword() {
    var forgotAccount = {
      email: this.forgotEmail,
      action: true
    }
    this.apiProvider.forgotPassword(forgotAccount).then((data) => {
      this.account = data;
      if (this.account.response === 'success') {
        this.showForgotPage = false;
      } else {
        let toast = this.toastCtrl.create({
          message: this.account.data,
          duration: 3000,
          position: 'middle',
          cssClass: 'showToast'
        });
        toast.present();
      }
    })
  }

  otpSubmit() {
    var otpObject = {
      email: this.forgotEmail,
      otp: this.otp,
      action: false
    }
    this.apiProvider.forgotPassword(otpObject).then((data) => {
      this.account = data;
      if (this.account.response === 'success') {
        this.navCtrl.push('OtpPage');
      } else {
        let toast = this.toastCtrl.create({
          message: this.account.data,
          duration: 3000,
          position: 'middle',
          cssClass: 'showToast'
        });
        toast.present();
      }
    })
  }

}
