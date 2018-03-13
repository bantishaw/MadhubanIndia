import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController,
    public apiProvider: Api,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public http: Http) { }

  doSignup() {
    var account = {
      name: this.signUpName,
      email: this.signUpEmail,
      password: this.signUpPassword,
      Confirmpassword: this.ConfirmSignUpPassword,
      phoneNumber: this.signUpPhone
    }
    this.apiProvider.newUserSignUp(account).then((data) => {
      this.newUserAccount = data;
      if (this.newUserAccount.response === 'success') {
        this.navCtrl.push(MainPage);
      } else {
        let toast = this.toastCtrl.create({
          message: this.newUserAccount.data,
          duration: 3000,
          position: 'middle',
          cssClass: 'showToast'
        });
        toast.present();
      }
    })
  }
}
