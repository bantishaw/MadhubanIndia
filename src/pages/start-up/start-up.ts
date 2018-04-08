import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { TutorialPage } from '../tutorial/tutorial';

@IonicPage()
@Component({
  selector: 'page-start-up',
  templateUrl: 'start-up.html',
})
export class StartUpPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private menu: MenuController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartUp');
    setTimeout(() => {
      this.navCtrl.push(TutorialPage);
    }, 1000);

  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }

}
