import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.currentItems = [
      {
        "name": "Apple",
        "profilePic": "assets/img/apple.jpg",
        "rate": "30/kg"
      },
      {
        "name": "Banana",
        "profilePic": "assets/img/banana.jpg",
        "rate": "30/kg"
      },
      {
        "name": "Black Grapes",
        "profilePic": "assets/img/black_grapes.jpg",
        "rate": "30/kg"
      },
      {
        "name": "Green Grapes",
        "profilePic": "assets/img/green_grapes.jpg",
        "rate": "30/kg"
      },
      {
        "name": "Orange",
        "profilePic": "assets/img/orange.jpg",
        "rate": "30/kg"
      },
      {
        "name": "Pineapple",
        "profilePic": "assets/img/pineapple.jpg",
        "rate": "30/kg"
      }
      ,
      {
        "name": "Strawberry",
        "profilePic": "assets/img/strawberry.jpg",
        "rate": "30/kg"
      },
      {
        "name": "Watermelon",
        "profilePic": "assets/img/watermelon.jpg",
        "rate": "30/kg"
      }

    ]
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}
