import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TutorialPage} from '../tutorial/tutorial';

@IonicPage()
@Component({
  selector: 'page-start-up',
  templateUrl: 'start-up.html',
})
export class StartUpPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartUpPag23432');
    console.log('Arun ');

    setTimeout(() => {
     
      this.navCtrl.push(TutorialPage);
    }, 3000);
   
  }

}
