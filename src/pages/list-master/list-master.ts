import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, LoadingController, NavParams } from 'ionic-angular';
import { Item } from '../../models/item';
import { Items } from '../../providers/providers';
import { Http, Headers } from '@angular/http';
import { Api } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];
  fetchCollection: any;
  result: any;
  showDataFailureText: any;
  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController,
    public apiProvider: Api, public http: Http, public loadingCtrl: LoadingController,
    public navParams: NavParams) {
    this.fetchCollection = navParams.get('menuDetails');

  }

  ionViewDidLoad() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: "wrapper"
    });
    loading.present();
    this.apiProvider.getSubMenuItems(this.fetchCollection).then((data) => {
      this.result = data;
      if (this.result.response === "success") {
        loading.dismiss();
        setTimeout(() => {
          this.currentItems = this.result.data[0].FruitsNameAndPrices
        }, 0);
      } else {
        loading.dismiss();
        setTimeout(() => {
          this.showDataFailureText = this.result.data;
        }, 0);
      }
    })
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
