import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ListMasterPage } from '../list-master/list-master';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  homeItemsDecorations : any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.homeItemsDecorations = [
      {
        "img_path" : "assets/img/fruits.jpg",
        "service_name" : "Fruits"
      },
      {
        "img_path" : "assets/img/WaterCan.jpg",
        "service_name" : "Water Can"
      },
      {
        "img_path" : "assets/img/mehendi.jpg",
        "service_name" : "Mehendi"
      },
      {
        "img_path" : "assets/img/carDecoration.jpg",
        "service_name" : "Vehicle Decoration"
      }
    ]
  }
  
}
