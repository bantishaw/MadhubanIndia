import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { User } from '../../providers/providers';
import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signUpName: string;
  signUpEmail: string;
  signUpPassword: string;
  signUpAddressType: string;
  signUpAddress: string;
  signUpPhone: string

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService) { }

  doSignup() {
    var account = {
      name: this.signUpName,
      email: this.signUpEmail,
      password: this.signUpPassword,
      addressType: this.signUpAddressType,
      address: this.signUpAddress,
      phoneNumber: this.signUpPhone
    }
    console.log("account",account)
    this.user.signup(account).subscribe((resp) => {
      this.navCtrl.push(MainPage);
    }, (err) => {

      this.navCtrl.push(MainPage);

      // Unable to sign up
      let toast = this.toastCtrl.create({
        //message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
