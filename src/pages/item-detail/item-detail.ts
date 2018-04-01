import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Items } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;
  keyValue: any;
  numberOfItemsOrdered: number;
  totalAmount: number;
  constructor(public navCtrl: NavController, navParams: NavParams, items: Items) {
    this.item = navParams.get('item') || items.defaultItem;
    this.keyValue = Object.keys(this.item)[0];

  }

  ionViewDidLoad() {
    this.numberOfItemsOrdered = 0;
    this.totalAmount = 0;
  }

  decreaseQuantity(decreaseNumber) {
    if (decreaseNumber) {
      this.numberOfItemsOrdered = this.numberOfItemsOrdered - 1;
      this.totalAmount = this.totalAmount - this.item.rate;
    }
  }

  increaseQuantity(increaseNumber) {
    if (increaseNumber >= 0) {
      this.numberOfItemsOrdered = this.numberOfItemsOrdered + 1;
      this.totalAmount = this.totalAmount + this.item.rate;
    }
  }
}


