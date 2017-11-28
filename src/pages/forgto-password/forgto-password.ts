import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';

/**
 * Generated class for the ForgtoPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgto-password',
  templateUrl: 'forgto-password.html',
})
export class ForgtoPasswordPage {
  forgotEmail : string;
  constructor(public navCtrl: NavController, public navParams: NavParams,private emailComposer: EmailComposer) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgtoPasswordPage');
  }

  forgotPassword() {
    console.log(this.forgotEmail)
    
    let email = {
      to: 'sainaik786@gmail.com',
      cc: 'banti.shaw@outlook.com',
      subject: 'Cordova Icons',
      body: 'How are you? Nice greetings from Leipzig',
      isHtml: true
    };
    console.log(email)
    // Send a text message using default options
    //this.emailComposer.open(email)
    //console.log(this.emailComposer)
    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
        //Now we know we can send
        console.log("send")
      }
     });

  }
  
}
