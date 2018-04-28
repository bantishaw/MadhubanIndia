import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Api } from '../../providers/providers';
import { Http } from '@angular/http';
import { LoginPage } from '../login/login'
import { Item } from '../../models/item';
import { FilterUserOrderPage } from '../filter-user-order/filter-user-order';
import { IndividualOrderOfUserPage } from '../individual-order-of-user/individual-order-of-user';

@IonicPage()
@Component({
  selector: 'page-your-orders',
  templateUrl: 'your-orders.html',
})
export class YourOrdersPage {
  isItemDeliveredToUser = false;
  isSearchbarOperandToBeShowen = false;
  currentOrderThatUserTypeForSearch: any;
  myordersObject: any[];
  dataObject: any;
  firstUserStatus: string;
  priceDisplay: any;
  email: any;
  particularOrderItemisClicked = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiProvider: Api, public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public http: Http) {
  }

  ionViewDidLoad() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: "wrapper"
    });
    loading.present();
    var queryDoc = {
      reference_email: this.apiProvider.settingsInformation.settingsInformation[0].email
    }
    this.apiProvider.getMyOrders(queryDoc).then((result) => {
      this.dataObject = result;
      if (this.dataObject.response === "success") {
        loading.dismiss();
        setTimeout(() => {
          this.myordersObject = this.dataObject.data[0].myOrders;
          this.currentOrderThatUserTypeForSearch = this.myordersObject;
        }, 0)
      } else {
        loading.dismiss();
        setTimeout(() => {
          this.firstUserStatus = this.dataObject.data;
        }, 0)
      }
    })
  }

  displayDetailsofThatOrderedItem(item) {
    this.particularOrderItemisClicked = true;
    this.navCtrl.push(IndividualOrderOfUserPage, { content: item });
  }

}


