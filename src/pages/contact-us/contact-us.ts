import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Api } from '../../providers/providers';
import { Http, Headers } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
  name: any;
  emailId: any;
  query: any;
  mobileNumber: any;
  querySuccess: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,
    public apiProvider: Api, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
  }

  submitQuery() {
    var query = {
      name: this.name,
      emailAddress: this.emailId,
      query: this.query,
      mobile: this.mobileNumber
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (!query.name || !query.emailAddress || !query.query) {
      this.toastMessage("Please enter all mandatory fields")
    } else {
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        cssClass: "wrapper"
      });
      loading.present();
      this.apiProvider.contactUs(query).then((data) => {
        this.querySuccess = data;
        if (this.querySuccess.response === 'success') {
          loading.dismiss();
          setTimeout(() => {
            this.toastMessage(this.querySuccess.data)
          }, 500);
        } else {
          loading.dismiss();
          setTimeout(() => {
            this.toastMessage(this.querySuccess.data)
          }, 500);
        }
      })
    }
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
