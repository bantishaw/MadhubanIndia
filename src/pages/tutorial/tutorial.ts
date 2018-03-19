import { IonicPage, MenuController, NavController, Platform,Slides } from 'ionic-angular';
import { Component, ViewChild, trigger, transition, style, state, animate, keyframes } from '@angular/core';
import {LoginPage} from '../login/login';
import { TranslateService } from '@ngx-translate/core';
import {SignupPage} from '../signup/signup';


export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  animations: [

    trigger('bounce', [
      state('*', style({
        transform: 'translateX(0)'
      })),
      transition('* => rightSwipe', animate('700ms ease-out', keyframes([
        style({transform: 'translateX(0)', offset: 0}),
        style({transform: 'translateX(-65px)', offset: .3}),
        style({transform: 'translateX(0)', offset: 1})
      ]))),
      transition('* => leftSwipe', animate('700ms ease-out', keyframes([
        style({transform: 'translateX(0)', offset: 0}),
        style({transform: 'translateX(65px)', offset: .3}),
        style({transform: 'translateX(0)', offset: 1})
      ])))
    ])
  ]
})
export class TutorialPage {
 
  @ViewChild(Slides) slides: Slides;
  skipMsg: string = "Skip";
  state: string = 'x';

  constructor(public navCtrl: NavController) {

  }

  newUserRegister(){
    this.navCtrl.push(SignupPage);
  }

  doLogin() {
    this.navCtrl.push(LoginPage);
  }

  slideChanged() {
    if (this.slides.isEnd()){
      this.skipMsg = "Alright, I got it";
      console.log("Arun2.Chauhan");

  }
}

  slideMoved() {
    if (this.slides.getActiveIndex() >= this.slides.getPreviousIndex()){
     console.log("Arun1.Chauhan");
      this.state = 'rightSwipe';
    }
    else
      this.state = 'leftSwipe';
  }

  animationDone() {
    this.state = 'x';
  }


}
