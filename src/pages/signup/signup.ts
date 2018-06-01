import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController, MenuController } from 'ionic-angular';
import { MainPage } from '../pages';
import { Api } from '../../providers/providers';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signUpName: string;
  signUpEmail: string;
  signUpPassword: string;
  ConfirmSignUpPassword: string;
  signUpPhone: string
  newUserAccount: any;
  signUpLastName: string;
  constructor(public navCtrl: NavController,
    public apiProvider: Api,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public http: Http,
    public loadingCtrl: LoadingController,
    private menu: MenuController) { }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }

  doSignup() {
    var account = {
      name: this.signUpName,
      lastName: this.signUpLastName,
      email: this.signUpEmail.toLowerCase(),
      password: this.signUpPassword,
      Confirmpassword: this.ConfirmSignUpPassword,
      phoneNumber: this.signUpPhone
    }
    var nameValidator = new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$");
    var emailValidator = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
    // var passwordValidator = new RegExp("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}")
    if (!account.name || !account.lastName || !account.email || !account.password || !account.Confirmpassword || !account.phoneNumber) {
      this.toastMessage("Enter all the Details")
    } else if (!(nameValidator.test(account.name))) {
      this.toastMessage("Enter a valid First name")
    } else if (!(nameValidator.test(account.lastName))) {
      this.toastMessage("Enter a valid Last name")
    } else if (!(emailValidator.test(account.email))) {
      this.toastMessage("Enter a valid Email address")
    } else if (account.phoneNumber.length !== 10) {
      this.toastMessage("Enter a valid Phone number")
    } else if (account.password !== account.Confirmpassword) {
      this.toastMessage("Password and Confirm password are not same")
    } else {
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        cssClass: "wrapper"
      });
      loading.present();
      this.apiProvider.newUserSignUp(account).then((data) => {
        this.newUserAccount = data;
        if (this.newUserAccount.response === 'success') {
          loading.dismiss();
          setTimeout(() => {
            window.localStorage.setItem('password', account.password);
            window.localStorage.setItem('username', account.email);
            this.navCtrl.push(MainPage);
          }, 500);
        } else {
          loading.dismiss();
          setTimeout(() => {
            this.toastMessage(this.newUserAccount.data)
          }, 500);
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
}
