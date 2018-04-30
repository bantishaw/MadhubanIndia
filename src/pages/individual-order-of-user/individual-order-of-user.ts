import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Api } from '../../providers/providers';
import { AlertController } from 'ionic-angular';
import { YourOrdersPage } from '../your-orders/your-orders';
import { ToastController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-individual-order-of-user',
  templateUrl: 'individual-order-of-user.html',
})
export class IndividualOrderOfUserPage {
  OrderedindiVidualItemDetails: any;
  uniqueKey;
  dataObject: any;
  showCancelledStamp: Boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiProvider: Api, public alertCtrl: AlertController,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, ) {
    this.OrderedindiVidualItemDetails = navParams.get('content');
    this.uniqueKey = navParams.get('uniqueKey');
    console.log("MyUniquevalue " + this.uniqueKey);
  }

  ionViewDidLoad() {
  }

  cancelOrder(orderID, individualPrice) {
    var queryDoc = {
      "reference_email": this.apiProvider.settingsInformation.settingsInformation[0].email,
      "itemStatus": "Cancelled",
      "order_id": orderID,
      "uniqueKey": this.uniqueKey,
      "particularProductPrice": individualPrice
    }
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: "wrapper"
    });
    let confirm = this.alertCtrl.create({
      title: 'Cancel Order',
      message: 'Are you Sure you want to cancel this order',
      buttons: [
        {
          text: 'YES',
          handler: () => {
            loading.present();
            this.apiProvider.cancelOrder(queryDoc).then((result) => {
              this.dataObject = result;
              if (this.dataObject.response === "success") {
                loading.dismiss();
                this.toastMessage(this.dataObject.data)
                this.showCancelledStamp = false;
              }
            })
          }
        },
        {
          text: 'NO',
          handler: () => {
            console.log("User don't want to Cancel Order !!")
          }
        }
      ]
    });
    confirm.present()
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
