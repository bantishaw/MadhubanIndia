import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { ListMasterPage } from '../list-master/list-master';
import { ShoppingCartPage } from '../shopping-cart/shopping-cart'
import { Http } from '@angular/http';
import { Api } from '../../providers/providers';
import { App } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  homeItemsDecorations: any;
  homeMenuService: any;
  addToCartLength: any;
  cartResult: any;
  cartData: any;
  slideDataResult: any;
  slideData: any;
  CurrentlySerivesOffered: any;
  email: any;
  welcomeMessage: any;
  ourLocations: any;
  userLocationData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: Api,
    public http: Http, public loadingCtrl: LoadingController, public appCtrl: App, public geolocation: Geolocation,
    public alertCtrl: AlertController, public toastCtrl: ToastController) {
    this.email = window.localStorage.getItem('username')
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: "wrapper"
    });
    var userData = {
      email : window.localStorage.getItem('username')
    }
    loading.present();
    this.apiProvider.getHomePageSlidingImages(userData).then((result) => {
      this.slideDataResult = result;
      if (this.slideDataResult.response === "success") {
        this.apiProvider.getHomeMenuService().then((data) => {
          this.homeMenuService = data;
          if (this.homeMenuService.response === "success") {
            loading.dismiss();
            setTimeout(() => {
              this.homeItemsDecorations = this.homeMenuService.data
              this.slideData = this.slideDataResult.data[0].HomePageSlidingImages
              this.CurrentlySerivesOffered = this.slideDataResult.data[0].userNotice
              this.welcomeMessage = this.homeMenuService.data[0].message
              this.ourLocations = this.slideDataResult.data[0].FreshPoolServiceLocations
            }, 0);
          }
        })
      }
    })
  }

  processRequest(serviceDetails) {
    console.log('in processRequest ', serviceDetails);
    this.navCtrl.push(ListMasterPage, { menuDetails: serviceDetails });
  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  goToShopping() {
    this.navCtrl.push(ShoppingCartPage)
  }

  ionViewDidEnter() {
    let queryCartObject = {
      "reference_email": this.email
    }
    this.apiProvider.queryCartlength(queryCartObject).then((data) => {
      this.cartResult = data;
      if (this.cartResult.response === "success") {
        this.addToCartLength = this.cartResult.length;
        this.cartData = this.cartResult.data;
        console.log("this.addToCartLength", this.addToCartLength)
      }
    })
  }

  navigateLocation() {
    var options = {
      title: 'Change your Location',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          handler: () => {
            console.log('Cancel is Clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            console.log(data);
            let userLocation = {
              "location": data
            }
            if (data) {
              let loading = this.loadingCtrl.create({
                spinner: 'crescent',
                cssClass: "wrapper"
              });
              loading.present();
              this.apiProvider.updateUserLocation(userLocation).then((result) => {
                this.userLocationData = result;
                if (this.userLocationData.response === "success") {
                  loading.dismiss();
                  this.toastMessage(`Location has been changed to ${userLocation.location}`)
                  setTimeout(() => {
                    this.homeItemsDecorations = this.userLocationData.data
                    this.welcomeMessage = this.userLocationData.data[0].message
                  }, 0);
                }
              })
            } else {
              this.toastMessage(`Please select desired location`)
            }
          }
        }
      ], inputs: []
    };

    // Now we add the radio buttons
    for (let i = 0; i < this.ourLocations.length; i++) {
      options.inputs.push({ name: 'options', value: this.ourLocations[i], label: this.ourLocations[i], type: 'radio' });
    }

    // Create the alert with the options
    let alert = this.alertCtrl.create(options);
    alert.present();
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

}
