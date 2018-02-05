import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/providers';
import { Http } from '@angular/http';


@IonicPage()
@Component({
  selector: 'page-forgto-password',
  templateUrl: 'forgto-password.html',
})
export class ForgtoPasswordPage {
  forgotEmail: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiProvider: Api, public http: Http) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgtoPasswordPage');
  }

  forgotPassword() {
    var forgotAccount = {
      email : this.forgotEmail
    }
    this.apiProvider.forgotPassword(forgotAccount).then((data) => {
      console.log(data)
    })
  }

}
