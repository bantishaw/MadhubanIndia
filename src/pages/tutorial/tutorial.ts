import { IonicPage, MenuController, NavController, Platform, Slides } from 'ionic-angular';
import { Component } from '@angular/core';
import { LoginPage } from '../login/login';
import { TranslateService } from '@ngx-translate/core';
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
