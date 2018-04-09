import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ItemOptions, ToastController } from 'ionic-angular';
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
  userName: any;
  userPhoneNumber: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: Api,
    public loadingCtrl: LoadingController, private alertCtrl: AlertController, public toastCtrl: ToastController, ) {
    this.shoppingCartSegment = "product";
  }

  ionViewDidLoad() {
    console.log(this.apiProvider.shoppingCartData.data[0])
    this.disableTab = true;
    this.priceDisplay = this.apiProvider.shoppingCartData.data[0].total_amount
    this.productDisplay = this.apiProvider.shoppingCartData.data[0].order_descriptiion
    this.cartlength = this.apiProvider.shoppingCartData.data[0].order_descriptiion.length
    this.userName = this.apiProvider.settingsInformation.settingsInformation[0].name
    this.userPhoneNumber = this.apiProvider.settingsInformation.settingsInformation[0].phoneNumber
  }

  removeItemFromCart(removeItem) {
    let removeObject = {
      "reference_email": this.apiProvider.settingsInformation.settingsInformation[0].email,
      "order_descriptiion": removeItem
    }
    let alert = this.alertCtrl.create({
      title: 'Remove item',
      message: 'Are you sure you want to remove this item?',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'REMOVE',
          handler: () => {
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
      ]
    });
    alert.present();
  }

  changeQuantity(item) {
    let alert = this.alertCtrl.create({
      title: 'Change quantity',
      inputs: [
        {
          name: 'quantity',
          placeholder: 'Quantity',
          type: 'number'

        }
      ],
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'SAVE',
          handler: data => {
            if (data.quantity >= 1) {
              item.quantity = data.quantity
              let updateQuuantityObject = {
                "reference_email": this.apiProvider.settingsInformation.settingsInformation[0].email,
                "order_descriptiion": item
              }
              let loading = this.loadingCtrl.create({
                spinner: 'crescent',
                cssClass: "wrapper"
              });
              loading.present();
              this.apiProvider.changeQuantityItemCart(updateQuuantityObject).then((data) => {
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
            } else {
              this.toastMessage("Quantity cannot be less than 1")
            }
          }
        }
      ]
    });
    alert.present();
  }

  toastMessage(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'middle',
      cssClass: 'showToast'
    });
    toast.present();
  }

  continue() {
    this.disableTab = false;
    this.shoppingCartSegment = "delivery";
  }

}
