import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Items } from '../../providers/providers';
import { Api } from '../../providers/providers';
import { ShoppingCartPage } from '../shopping-cart/shopping-cart'

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;
  keyValue: any;
  numberOfItemsOrdered: number;
  totalAmount: number;
  databaseCartResult: any;
  cartResultDisplay: any;
  addToCartLength: any;
  constructor(public navCtrl: NavController, navParams: NavParams, items: Items, public apiProvider: Api,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.item = navParams.get('item')
    this.keyValue = Object.keys(this.item)[0];

  }

  ionViewDidLoad() {
    this.numberOfItemsOrdered = 0;
    this.totalAmount = 0;
    console.log(this.item)
    let queryCartObject = {
      "reference_email": this.apiProvider.settingsInformation.settingsInformation[0].email
    }
    this.apiProvider.queryCartlength(queryCartObject).then((data) => {
      this.cartResultDisplay = data;
      if (this.cartResultDisplay.response === "success") {
        this.addToCartLength = this.cartResultDisplay.length;
        //this.cartData = this.cartResultDisplay.data;
        console.log("this.addToCartLength", this.addToCartLength)
      }
    })

  }

  decreaseQuantity(decreaseNumber) {
    if (decreaseNumber) {
      this.numberOfItemsOrdered = this.numberOfItemsOrdered - 1;
      this.totalAmount = this.totalAmount - this.item.rate;
    }
  }

  increaseQuantity(increaseNumber) {
    if (increaseNumber >= 0) {
      this.numberOfItemsOrdered = this.numberOfItemsOrdered + 1;
      this.totalAmount = this.totalAmount + this.item.rate;
    }
  }

  addToCart() {
    var itemsToBeAdded = {
      "reference_email": this.apiProvider.settingsInformation.settingsInformation[0].email,
      "order_descriptiion": [
        {
          "product": this.item.product,
          "quantity": this.numberOfItemsOrdered,
          "rate": this.item.rate,
          "description": this.item.description,
          "productPic": this.item.profilePic
        }
      ],
      "total_amount": this.totalAmount
    }
    if (this.numberOfItemsOrdered && this.totalAmount) {
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        cssClass: "wrapper"
      });
      loading.present();
      this.apiProvider.addToCart(itemsToBeAdded).then((data) => {
        this.databaseCartResult = data;
        if (this.databaseCartResult.response === "success") {
          loading.dismiss();
          setTimeout(() => {
            this.toastMessage(this.databaseCartResult.data)
            this.ionViewDidLoad();
          }, 0);
        } else {
          loading.dismiss();
          setTimeout(() => {
            this.toastMessage(this.databaseCartResult.data)
          }, 0);
        }
      })
    } else {
      this.toastMessage("Please select quantity and proceed to checkout")
    }
  }

  toastMessage(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'middle',
      cssClass: 'showToast'
    });
    toast.present();
  }

  goToShopping() {
    this.navCtrl.push(ShoppingCartPage)
  }

  ionViewDidEnter() {
    this.ionViewDidLoad();
  }
}


