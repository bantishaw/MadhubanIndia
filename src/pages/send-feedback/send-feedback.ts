import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Api } from '../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-send-feedback',
  templateUrl: 'send-feedback.html',
})
export class SendFeedbackPage {
  feedback: string;
  submitResult: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public apiProvider: Api,
    public http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendFeedbackPage');
  }

  submitFeedback() {
    var userFeed = {
      feedback: this.feedback
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (!userFeed.feedback) {
      this.toastMessage("Empty feedback cannot be sent")
    } else {
      this.apiProvider.submitFeedback(userFeed).then((data) => {
        this.submitResult = data;
        console.log(this.submitResult)
        if (this.submitResult.response === 'success') {
          console.log()
          this.toastMessage(this.submitResult.data)
        } else {
          this.toastMessage(this.submitResult.data)
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
