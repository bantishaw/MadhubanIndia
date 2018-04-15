import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Api } from '../../providers/providers';
import { ShowContentPage } from '../show-content/show-content';
import { SocialSharing } from '@ionic-native/social-sharing';
@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {
  About_Page_Headings: any;
  displayAboutUs: any;
  FreshPoolLink: any;
  constructor(
    private socialSharing: SocialSharing,
    private actionSheetControler: ActionSheetController,
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
        console.log(this.About_Page_Headings);
        loading.dismiss();
        setTimeout(() => {
          this.displayAboutUs = this.About_Page_Headings.data[0].aboutUsContents
        }, 0)
      }
    })

  }
  showContent(getPageInfo) {
    if (" ShareFreshPool" == getPageInfo.content) {
      this.socialSharing.share(this.FreshPoolLink)
        .then(() => {

        }).catch(() => {

        });
    }
    else {
      console.log(getPageInfo.content)
      this.navCtrl.push(ShowContentPage, { content: getPageInfo });
    }
  }//showContent
}//class















//   showContent(getPageInfo) {

//     console.log("David -1 " + getPageInfo.content);
//     console.log("David -2 " + " ShareFreshPool");
//     console.log("David-2 "+(" ShareFreshPool" == getPageInfo.content ));
//     if (" ShareFreshPool" == getPageInfo.content) {
//       console.log("David-3  " + getPageInfo.content);
//       let ShareFreshPool = this.actionSheetControler.create({
//         title: "Share Via",
//         buttons: [

//           {
//             text: "Share on Facebook",
//             icon: "logo-facebook"
//           },
//           {
//             text: "Share on Twitter",
//             icon: "logo-twitter"
//           },
//           {
//             text: "Share on Whatsapp",
//             icon: "logo-whatsapp"
//           },
//           {
//             text: "Cancel",
//             role: "destructive"
//           }

//         ]
//       });
//       ShareFreshPool.present();

//     }
//  else{
//     console.log(getPageInfo.content)
//     this.navCtrl.push(ShowContentPage, { content: getPageInfo });
//   }}


