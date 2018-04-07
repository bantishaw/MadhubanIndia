import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-shopping-cart',
  templateUrl: 'shopping-cart.html',
})
export class ShoppingCartPage {
  shoppingCartSegment : any;
  disableTab : Boolean = true;
  productDisplay : any;
  priceDisplay : any;
  cartlength : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public apiProvider: Api) {
    this.shoppingCartSegment = "product";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoppingCartPage');
    console.log(this.apiProvider.shoppingCartData.data[0])
    this.disableTab = true;
    this.priceDisplay = this.apiProvider.shoppingCartData.data[0].total_amount
    this.productDisplay = this.apiProvider.shoppingCartData.data[0].order_descriptiion
    this.cartlength = this.apiProvider.shoppingCartData.data[0].order_descriptiion.length
    console.log(this.cartlength)
  }

}
