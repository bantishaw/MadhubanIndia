import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Api } from '../../providers/providers';
import { ShowContentPage } from '../show-content/show-content';
@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {
  About_Page_Headings: any;
  displayAboutUs: any;
  showFailureMessage : boolean = false;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public apiProvider: Api, public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public http: Http) {
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: "wrapper"
    });
    loading.present();
    this.apiProvider.getAboutUsPage().then((result) => {
      this.About_Page_Headings = result;
      if (this.About_Page_Headings.response === "success") {
        loading.dismiss();
        setTimeout(() => {
          this.displayAboutUs = this.About_Page_Headings.data[0].aboutUsContents
        }, 0)
      } else{
        loading.dismiss();
        setTimeout(() => {
          this.showFailureMessage = true;
        }, 0)
      }
    })

  }

  showContent(getPageInfo) {
    this.navCtrl.push(ShowContentPage, { content: getPageInfo });
  }

}
