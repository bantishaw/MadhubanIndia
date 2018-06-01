import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, MenuController } from 'ionic-angular';
import { Api } from '../../providers/providers';
import { Http } from '@angular/http';
import { LoginPage } from '../login/login'

@IonicPage()
@Component({
  selector: 'page-forgto-password',
  templateUrl: 'forgto-password.html',
})
export class ForgtoPasswordPage {
  forgotEmail: string;
  account: any;
  showForgotPage: number = 0;
  otp: number;
  newPassword: any;
  reNewPassword: any;
  isActiveToggleTextPassword: Boolean = true;
  showPasswordEye: Boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiProvider: Api, public http: Http, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private menu: MenuController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgtoPasswordPage');
    this.showForgotPage = 0;
    console.log(typeof this.showForgotPage, this.showForgotPage)
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }

  forgotPassword() {
    var forgotAccount = {
      email: this.forgotEmail.toLowerCase(),
      action: 1
    }
    if (!forgotAccount.email) {
      this.toastMessage("Email Address cannot be empty")
    } else {
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        cssClass: "wrapper"
      });
      loading.present();
      this.apiProvider.forgotPassword(forgotAccount).then((data) => {
        this.account = data;
        if (this.account.response === 'success') {
          loading.dismiss();
          setTimeout(() => {
            this.showForgotPage = 1;
          }, 500);
        } else {
          loading.dismiss();
          setTimeout(() => {
            this.toastMessage(this.account.data)
          }, 500);
        }
      })
    }
  }

  otpSubmit() {
    var otpObject = {
      email: this.forgotEmail.toLowerCase(),
      otp: this.otp,
      action: 2
    }
    if (!otpObject.otp) {
      this.toastMessage("Enter the OTP to change password")
    } else {
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        cssClass: "wrapper"
      });
      loading.present();
      this.apiProvider.forgotPassword(otpObject).then((data) => {
        this.account = data;
        if (this.account.response === 'success') {
          loading.dismiss();
          setTimeout(() => {
            this.showForgotPage = 2;
          }, 500);
        } else {
          loading.dismiss();
          setTimeout(() => {
            this.toastMessage(this.account.data)
          }, 500);
        }
      })
    }
  }

  changePassword() {
    let changePass = {
      email: this.forgotEmail.toLowerCase(),
      password: this.newPassword,
      action: 3
    }
    if (!this.newPassword || !this.reNewPassword) {
      this.toastMessage('Passwords cannot be empty')
    } else if (this.newPassword !== this.reNewPassword) {
      this.toastMessage('Passwords are not matching')
    } else {
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        cssClass: "wrapper"
      });
      loading.present();
      this.apiProvider.forgotPassword(changePass).then((data) => {
        this.account = data;
        if (this.account.response === 'success') {
          loading.dismiss();
          setTimeout(() => {
            this.toastMessage(this.account.data)
          }, 500);
          setTimeout(() => {
            this.navCtrl.push(LoginPage);
          }, 1000);
        } else {
          loading.dismiss();
        }
      })
    }
  }

  toastMessage(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'middle',
      cssClass: 'showToast'
    });
    toast.present();
  }

  toggleTextPassword() {
    this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword == true) ? false : true;
    this.showPasswordEye = (this.showPasswordEye == true) ? false : true;
  }
  getType() {
    return this.isActiveToggleTextPassword ? 'password' : 'text';
  }

  hideAndShow() {
    return this.showPasswordEye ? 'eye' : 'eye-off';
  }

}
