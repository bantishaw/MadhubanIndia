import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-shopping-cart',
  templateUrl: 'shopping-cart.html',
})
export class ShoppingCartPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public apiProvider: Api) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoppingCartPage');
    console.log(this.apiProvider.shoppingCartData.data[0])
  }

}
