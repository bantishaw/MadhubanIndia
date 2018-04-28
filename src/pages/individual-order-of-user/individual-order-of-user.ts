import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-individual-order-of-user',
  templateUrl: 'individual-order-of-user.html',
})
export class IndividualOrderOfUserPage {
  OrderedindiVidualItemDetails: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.OrderedindiVidualItemDetails = navParams.get('content');
  }

  ionViewDidLoad() {
  }

}
