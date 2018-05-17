import { IonicPage, NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';


export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {



  constructor(public navCtrl: NavController) {

  }

  newUserRegister() {
    this.navCtrl.push(SignupPage);
  }

  doLogin() {
    this.navCtrl.push(LoginPage);
  }



} 
