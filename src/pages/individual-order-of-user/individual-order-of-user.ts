import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-individual-order-of-user',
  templateUrl: 'individual-order-of-user.html',
})
export class IndividualOrderOfUserPage {
  OrderedindiVidualItemDetails: any;

  ac:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.OrderedindiVidualItemDetails = navParams.get('content');
    this.ac=navParams.get('name')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndividualOrderOfUserPage');
    console.log("IAmArun "+this.OrderedindiVidualItemDetails.date_of_order);
  }

}
