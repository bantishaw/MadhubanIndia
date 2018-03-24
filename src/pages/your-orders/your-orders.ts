import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the YourOrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-your-orders',
  templateUrl: 'your-orders.html',
})
export class YourOrdersPage {
  ordersObject: any[];
  cardItems: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YourOrdersPage');

    this.ordersObject = [{
      "_id": "1",
      "reference_id": "2",
      "reference_email": "banti.shaw@outlook.com",
      "myOrders": [
        {
          "order_id": "#1234567890",
          "date_of_order": "24th march,2018",
          "total_amount": "1800",
          "fruits_order_descriptiion": [
            {
              "fruit_name": "apple",
              "number_of_kg_bought": "20",
              "price_per_kg": "60"
            },
            {
              "fruit_name": "banana",
              "number_of_kg_bought": "10",
              "price_per_kg": "60"
            }
          ],
          "OrderStatus": "Delivered",
          "OrderStatusDescription": "Your order is succssfully delivered"
        },
        {
          "order_id": "#9234567890",
          "date_of_order": "27th march,2018",
          "total_amount": "1800",
          "fruits_order_descriptiion": [
            {
              "fruit_name": "kela",
              "number_of_kg_bought": "20",
              "price_per_kg": "60"
            }
          ],
          "OrderStatus": "Pending",
          "OrderStatusDescription": "Your order is pending for approval"

        },
        {
          "order_id": "#788234567890",
          "date_of_order": "27th march,2018",
          "total_amount": "1800",
          "fruits_order_descriptiion": [
            {
              "fruit_name": "kela",
              "number_of_kg_bought": "20",
              "price_per_kg": "60"
            }
          ],
          "OrderStatus": "Processing",
          "OrderStatusDescription": "Your order is processing"
        },
        {
          "order_id": "#108234567890",
          "date_of_order": "27th march,2018",
          "total_amount": "1800",
          "fruits_order_descriptiion": [
            {
              "fruit_name": "kela",
              "number_of_kg_bought": "20",
              "price_per_kg": "60"
            }
          ],
          "OrderStatus": "Cancelled",
          "OrderStatusDescription": "Your have cancelled your order"
        }
      ]
    }]
  }
}
