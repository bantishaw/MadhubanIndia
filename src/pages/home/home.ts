import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ListMasterPage } from '../list-master/list-master';
import { ShoppingCartPage } from '../shopping-cart/shopping-cart'
import { Http, Headers } from '@angular/http';
import { Api } from '../../providers/providers';
import { App } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: Api,
    public http: Http, public loadingCtrl: LoadingController, public appCtrl: App, ) {
  }

  ionViewDidLoad() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: "wrapper"
    });
    loading.present();
    this.apiProvider.getHomePageSlidingImages().then((result) => {
      this.slideDataResult = result;
      if (this.slideDataResult.response === "success") {
        this.apiProvider.getHomeMenuService().then((data) => {
          this.homeMenuService = data;
          if (this.homeMenuService.response === "success") {
            loading.dismiss();
            setTimeout(() => {
              this.homeItemsDecorations = this.homeMenuService.data[0].HomeMenuService
              this.slideData = this.slideDataResult.data[0].HomePageSlidingImages
              this.CurrentlySerivesOffered = this.slideDataResult.data[0].CurrentlySerivesOffered
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
    this.appCtrl.getRootNav().push(ShoppingCartPage)
  }

  ionViewDidEnter() {
    let queryCartObject = {
      "reference_email": this.apiProvider.settingsInformation.settingsInformation[0].email
    }
    this.apiProvider.queryCartlength(queryCartObject).then((data) => {
      this.cartResult = data;
      if (this.cartResult.response === "success") {
        this.addToCartLength = this.cartResult.length;
        this.cartData = this.cartResult.data;
      }
    })
  }

}
