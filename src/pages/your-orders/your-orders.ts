import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Api } from '../../providers/providers';
import { Http } from '@angular/http';
import { LoginPage } from '../login/login'


@IonicPage()
@Component({
  selector: 'page-your-orders',
  templateUrl: 'your-orders.html',
})
export class YourOrdersPage {
  ordersObject: any[];
  dataObject: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiProvider: Api, public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YourOrdersPage');
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
          this.ordersObject = this.dataObject.data;
        }, 0)
      } else{
        this.toastMessage("Please check your internet connectivity")
      }
    })
      
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

}
