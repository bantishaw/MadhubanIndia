import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Api } from '../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-shopping-cart',
  templateUrl: 'shopping-cart.html',
})
export class ShoppingCartPage {
  shoppingCartSegment: any;
  disableTab: Boolean = true;
  productDisplay: any;
  priceDisplay: any;
  cartlength: any;
  result: any;
  updatedResult: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: Api,
    public loadingCtrl: LoadingController) {
    this.shoppingCartSegment = "product";
  }

  ionViewDidLoad() {
    console.log(this.apiProvider.shoppingCartData.data[0])
    this.disableTab = true;
    this.priceDisplay = this.apiProvider.shoppingCartData.data[0].total_amount
    this.productDisplay = this.apiProvider.shoppingCartData.data[0].order_descriptiion
    this.cartlength = this.apiProvider.shoppingCartData.data[0].order_descriptiion.length
  }

  removeItemFromCart(removeItem) {
    let removeObject = {
      "reference_email": this.apiProvider.settingsInformation.settingsInformation[0].email,
      "order_descriptiion": removeItem
    }
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: "wrapper"
    });
    loading.present();
    this.apiProvider.removeItemFromCart(removeObject).then((data) => {
      this.result = data;
      if (this.result.response === "success") {
        loading.dismiss();
        setTimeout(() => {
          this.updatedResult = this.result.updatedCart
          this.priceDisplay = this.updatedResult.total_amount
          this.productDisplay = this.updatedResult.order_descriptiion
          this.cartlength = this.updatedResult.order_descriptiion.length
        }, 0);
      }
    })
  }
}
