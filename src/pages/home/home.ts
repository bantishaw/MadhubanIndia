import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ListMasterPage } from '../list-master/list-master';
import { Http, Headers } from '@angular/http';
import { Api } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  homeItemsDecorations: any;
  homeMenuService: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: Api,
    public http: Http,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: "wrapper"
    });
    loading.present();
    this.apiProvider.getHomeMenuService().then((data) => {
      this.homeMenuService = data;
      if (this.homeMenuService.response === "success") {
        loading.dismiss();
        setTimeout(() => {
          this.homeItemsDecorations = this.homeMenuService.data[0].HomeMenuService
        }, 500);
      }
    })
  }

  processRequest(serviceDetails) {
    console.log('in processRequest ', serviceDetails);
    this.navCtrl.push(ListMasterPage, { menuDetails: serviceDetails });
  }
}
