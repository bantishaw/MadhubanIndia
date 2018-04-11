import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Api } from '../../providers/providers';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;
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
  databaseAddressBox: any;
  gpsAddressBox: any;
  realTimeAddress: any;
  UserCityName: any;
  UserPinCode: any;
  UserState: any;
  UserStreetName: any;
  userNeighborhood: any;
  showLoading: any = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: Api,
    public loadingCtrl: LoadingController, private alertCtrl: AlertController, public toastCtrl: ToastController,
    public geolocation: Geolocation) {
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
    if (this.apiProvider.settingsInformation.settingsInformation[0].address) {
      this.databaseAddressBox = true;
      this.gpsAddressBox = false;
    } else {
      this.databaseAddressBox = false;
      this.gpsAddressBox = true;
    }
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
            this.apiProvider.removeItemFromCart(removeObject).then((finalResult) => {
              this.result = finalResult;
              if (this.result.response === "success") {
                loading.dismiss();
                setTimeout(() => {
                  this.updatedResult = this.result.data[0];
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
              this.apiProvider.changeQuantityItemCart(updateQuuantityObject).then((finalResult) => {
                this.result = finalResult;
                if (this.result.response === "success") {
                  loading.dismiss();
                  setTimeout(() => {
                    this.updatedResult = this.result.data[0]
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

  changeAddress() {
    this.databaseAddressBox = false;
    this.gpsAddressBox = true
  }

  seeLOcation() {
    var options = {
      enableHighAccuracy: true,
      timeout: Infinity,
      maximumAge: 0
    };
    this.showLoading = true;
    this.UserCityName = "", this.UserPinCode = "", this.UserState = "", this.UserStreetName = "";
    this.geolocation.getCurrentPosition(options).then((position) => {
      let positionObject = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
      this.apiProvider.getRealTimeUserAddress(positionObject).then((data) => {
        this.realTimeAddress = data;
        if (this.realTimeAddress.response === "success") {
          this.showLoading = false;
          console.log(this.realTimeAddress.googleResponse[0])
          this.UserCityName = this.realTimeAddress.googleResponse[0].city;
          this.UserPinCode = this.realTimeAddress.googleResponse[0].zipcode;
          this.UserState = this.realTimeAddress.googleResponse[0].administrativeLevels.level1long;
          this.UserStreetName = this.realTimeAddress.googleResponse[0].streetName + " " + this.realTimeAddress.googleResponse[0].extra.neighborhood
          console.log(this.UserCityName, this.UserPinCode, this.UserState, this.UserStreetName)
        }
      })
    }, (err) => {
      console.log(err);
    });
  }

}
