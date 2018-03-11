import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {LoginPage} from '../login/login';
import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-log-out',
  templateUrl: 'log-out.html',
})
export class LogOutPage {
  public todos = [];
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams, 
     private alertController: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogOutPage');
  
    let confirm = this.alertController.create({
      title: 'Log Out !',
      message: 'Are You Sure to Log Out ?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.push(LoginPage);
          }
        },
        {
          text: 'No',
          handler: () => {
            this.navCtrl.push(MainPage);
          }
        }
      ]
    });
    confirm.present()
  }

  
  }

 





