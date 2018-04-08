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
  isSearchbarOperandToBeShowen = false;
  currentItemsDuplicate: any;
  currentItemsThatUserTypeForSearch: any;
  currentItems: any;
  fetchCollection: any;
  result: any;
  showDataFailureText: any;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
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
          this.currentItems = this.result.data[0].FruitsNameAndPrices;
          this.currentItemsThatUserTypeForSearch = this.currentItems;
        }, 0);
      } else {
        loading.dismiss();
        setTimeout(() => {
          this.showDataFailureText = this.result.data;
        }, 0);
      }
    })
  }

  onSearch(event) {
    var FruitListarray = [];
    let valuethatUserTypeToSearch = event.target.value;
    if (!valuethatUserTypeToSearch) {
      this.WhenuserSearchItemAndDeleteIt();
    }
    else {
      for (var i = 0; i < this.currentItems.length; i++) {
        FruitListarray.push(this.currentItems[i].product);
      }
      if (valuethatUserTypeToSearch.trim()) {
        this.currentItems=this.currentItemsThatUserTypeForSearch;
        this.currentItems = this.currentItems.filter((topic) => {
          return ((topic.product.toLowerCase()).indexOf(valuethatUserTypeToSearch.toLowerCase()) !== -1);
        })
      }
    }
  }

  onCancel() {
     this.isSearchbarOperandToBeShowen = false;
    this.currentItems = this.currentItemsThatUserTypeForSearch;
  }

  /*
  Used when user will typr for some text and then erase it,
  this function will will still make serachBar visible with all CurrentItems avaliable
  */
  WhenuserSearchItemAndDeleteIt() {
    this.isSearchbarOperandToBeShowen = true;
   this.currentItems = this.currentItemsThatUserTypeForSearch;
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
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

}
