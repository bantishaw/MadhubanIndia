import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';

/**
 * Generated class for the FilterUserOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filter-user-order',
  templateUrl: 'filter-user-order.html',
})
export class FilterUserOrderPage {
  testCheckboxOpen: boolean;
  testCheckboxResult;
  ordersObject: any[];
  OrderType =['Order','Open order','Cancelled orders'];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController) {
    this.ordersObject=navParams.get('content');
  }

  ionViewDidLoad() {
  
    console.log('ionViewDidLoad FilterUserOrderPage');
   
  }
  showTimeFilterForOrder(item){
    console.log("Here_i_am "+item);
    if(item=='Order'){
    let alert = this.alertCtrl.create();
    alert.setTitle('How old order you want to see?');

    alert.addInput({
      type: 'checkbox',
      label: 'Last 30 days',
      value: 'value1',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Last 6 months',
      value: 'value2'
    });
    alert.addInput({
      type: 'checkbox',
      label: '2018',
      value: 'value2'
    });
    alert.addInput({
      type: 'checkbox',
      label: '2017',
      value: 'value2'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Apply',
      handler: data => {
        console.log('Checkbox data:', data);
        this.testCheckboxOpen = false;
        this.testCheckboxResult = data;
      }
    });
    alert.present().then(() => {
      this.testCheckboxOpen = true;
    });
  }
}
}
