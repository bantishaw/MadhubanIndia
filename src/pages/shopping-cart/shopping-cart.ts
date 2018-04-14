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
  showPriceAndContinue: any = false;
  showAddresSaveButton: any = false;
  flatNoBuildingNo: any;
  UserCityNameModel: any;
  UserStreetNameModel: any;
  flatNoBuildingNoModel: any;
  UserPinCodeModel: any;
  UserStateModel: any;
  landmarkModel: any;
  formatAddress: any;
  updateAddressResult: any;
  userAddress: any;
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
    this.userAddress = this.apiProvider.settingsInformation.settingsInformation[0].address
    this.productSegment();
  }

  productSegment() {
    this.showPriceAndContinue = true;
    this.showAddresSaveButton = false
  }

  deliverySegment() {
    if (this.apiProvider.settingsInformation.settingsInformation[0].address) {
      this.databaseAddressBox = true;
      this.gpsAddressBox = false;
      this.showPriceAndContinue = true;
      this.showAddresSaveButton = false
    } else {
      this.databaseAddressBox = false;
      this.gpsAddressBox = true;
      this.showPriceAndContinue = false;
      this.showAddresSaveButton = true
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
              item.quantity = parseInt(data.quantity)
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
    this.deliverySegment()
  }

  changeAddress() {
    this.databaseAddressBox = false;
    this.gpsAddressBox = true;
    this.showAddresSaveButton = true;
    this.showPriceAndContinue = false;
    this.UserCityName = "", this.UserPinCode = "", this.UserState = "";
    this.UserStreetName = "", this.formatAddress = "", this.landmarkModel = "", this.flatNoBuildingNoModel = "";
  }

  seeLOcation() {
    var options = {
      enableHighAccuracy: true,
      timeout: Infinity,
      maximumAge: 0
    };
    this.showLoading = true;
    this.UserCityName = "", this.UserPinCode = "", this.UserState = "";
    this.UserStreetName = "", this.formatAddress = "", this.landmarkModel = "", this.flatNoBuildingNoModel = "";
    this.geolocation.getCurrentPosition(options).then((position) => {
      let positionObject = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
      this.apiProvider.getRealTimeUserAddress(positionObject).then((data) => {
        this.realTimeAddress = data;
        if (this.realTimeAddress.response === "success") {
          this.showLoading = false;
          let alert = this.alertCtrl.create({
            title: 'Update with new address ?',
            message: this.realTimeAddress.googleResponse[0].formattedAddress,
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'UPDATE',
                handler: () => {
                  console.log(this.realTimeAddress.googleResponse[0])
                  this.formatAddress = this.realTimeAddress.googleResponse[0].formattedAddress;
                  this.UserCityName = this.realTimeAddress.googleResponse[0].city;
                  this.UserPinCode = this.realTimeAddress.googleResponse[0].zipcode;
                  this.UserState = this.realTimeAddress.googleResponse[0].administrativeLevels.level1long;
                  this.UserStreetName = this.realTimeAddress.googleResponse[0].streetName + " " + this.realTimeAddress.googleResponse[0].extra.neighborhood
                  console.log(this.UserCityName, this.UserPinCode, this.UserState, this.UserStreetName)
                }
              }
            ]
          });
          alert.present();
        }
      })
    }, (err) => {
      console.log(err);
    });
  }

  saveAddress() {
    let addressObject
    if (this.formatAddress) {
      addressObject = {
        "email": this.apiProvider.settingsInformation.settingsInformation[0].email,
        "address": this.flatNoBuildingNoModel + ", " + this.formatAddress + ", Landmark : " + this.landmarkModel
      }
      console.log("addressObject", addressObject)
    } else {
      addressObject = {
        "email": this.apiProvider.settingsInformation.settingsInformation[0].email,
        "address": this.flatNoBuildingNoModel + ", " + this.UserStreetName + ", " + this.UserCityName + ", " + this.UserState + ", " + this.UserPinCode + ", Landmark : " + this.landmarkModel
      }
      console.log("else addressObject", addressObject)
    }
    this.apiProvider.updateAddress(addressObject).then((data) => {
      this.updateAddressResult = data;
      if (this.updateAddressResult.response === "success") {
        this.gpsAddressBox = false
        this.databaseAddressBox = true;
        this.showPriceAndContinue = true;
        this.showAddresSaveButton = false
        this.userName = this.updateAddressResult.data.name
        this.userPhoneNumber = this.updateAddressResult.data.phoneNumber
        this.userAddress = this.updateAddressResult.data.address
      }
    })
  }
}
