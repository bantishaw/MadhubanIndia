import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-show-content',
  templateUrl: 'show-content.html',
})
export class ShowContentPage {
  showContent : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiProvider: Api) {
     this.showContent = navParams.get('content');
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowContentPage');
    console.log(this.showContent)
  }

}
