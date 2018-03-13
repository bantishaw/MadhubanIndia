import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
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
  showForgotPage: any = 0;
  otp: number;
  newPassword: any;
  reNewPassword: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiProvider: Api, public http: Http, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgtoPasswordPage');
    this.showForgotPage = 0;
    console.log(typeof this.showForgotPage, this.showForgotPage)
  }

  forgotPassword() {
    var forgotAccount = {
      email: this.forgotEmail,
      action: 1
    }
    this.apiProvider.forgotPassword(forgotAccount).then((data) => {
      this.account = data;
      if (this.account.response === 'success') {
        this.showForgotPage = 1;
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
      action: 2
    }
    this.apiProvider.forgotPassword(otpObject).then((data) => {
      this.account = data;
      if (this.account.response === 'success') {
        this.showForgotPage = 2;
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

  changePassword() {
    let changePass = {
      email: this.forgotEmail,
      password: this.newPassword,
      action: 3
    }
    let loading = this.loadingCtrl.create({
      spinner : 'crescent',
      cssClass : "wrapper"
    });
    if (!this.newPassword || !this.reNewPassword) {
      let toast = this.toastCtrl.create({
        message: 'Passwords cannot be empty',
        duration: 3000,
        position: 'middle',
        cssClass: 'showToast'
      });
      toast.present();
    } else if (this.newPassword !== this.reNewPassword) {
      let toast = this.toastCtrl.create({
        message: 'Passwords are not matching',
        duration: 3000,
        position: 'middle',
        cssClass: 'showToast'
      });
      toast.present();
    } else {
      
      this.apiProvider.forgotPassword(changePass).then((data) => {
        this.account = data;
        if (this.account.response === 'success') {
          setTimeout(() => {
            loading.present();
            loading.dismiss();
            this.navCtrl.push('LoginPage');
          }, 1000);
          let toast = this.toastCtrl.create({
            message: this.account.data,
            duration: 1000,
            position: 'middle',
            cssClass: 'showToast'
          });
          toast.present();
        }
      })
    }


  }

}
