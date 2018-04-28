import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Api } from '../../providers/providers';
import { Http } from '@angular/http';
import { LoginPage } from '../login/login'
import { Item } from '../../models/item';
import {FilterUserOrderPage} from '../filter-user-order/filter-user-order';
import {IndividualOrderOfUserPage} from '../individual-order-of-user/individual-order-of-user';
@IonicPage()
@Component({
  selector: 'page-your-orders',
  templateUrl: 'your-orders.html',
})
export class YourOrdersPage {
  // issearchClasshtml: any;
  isItemDeliveredToUser=false;
  isSearchbarOperandToBeShowen = false;
  currentOrderThatUserTypeForSearch: any;
  myordersObject: any[];
  dataObject: any;
  firstUserStatus : string;
  priceDisplay: any;
  email:any;
  particularOrderItemisClicked =false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiProvider: Api, public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public http: Http) {
  }


  ionViewDidLoad(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
 let loading = this.loadingCtrl.create({
    spinner: 'crescent',
    cssClass: "wrapper"
  });
  loading.present();
   var queryDoc = {
    reference_email: this.apiProvider.settingsInformation.settingsInformation[0].email
  }
  this.apiProvider.getMyOrders(queryDoc).then((result) => {
    this.dataObject = result;
    if (this.dataObject.response === "success") {
      loading.dismiss();
      setTimeout(() => {
        this.myordersObject = this.dataObject.data[0].myOrders;
        this.currentOrderThatUserTypeForSearch = this.myordersObject;
       
        console.log("ordersObject 2:::: "+this.dataObject.data[0].myOrders[0].order_id);
       console.log("currentItems 3:::: "+ this.myordersObject[1].date_of_order_placing);
       console.log("currentItems 3:::: "+ this.myordersObject[0].order_descriptiion[0].product);
       console.log("currentItems 4:::: "+ this.myordersObject[0].order_descriptiion[1].product);
       
      }, 0)
    } else {
      loading.dismiss();
      setTimeout(() => {
        this.firstUserStatus = this.dataObject.data;
      }, 0)
    }
  })
  }//ionViewDidLoad


  


  displayDetailsofThatOrderedItem(item){
   this.particularOrderItemisClicked=true;
 console.log("ItemsIsClicked2 "+item.product); 
 console.log("ItemsIsClicked1 "+item.date_of_order); 
 this.navCtrl.push(IndividualOrderOfUserPage, { content: item});
  }

//   searchIteminOrderPage(event) {
//     // this.issearchClasshtml="WithSearchionColProperty";
//     // console.log("I "+event.target.value);
//     var FruitListarray = [];
//     let valuethatUserTypeToSearch = event.target.value;
//     if (!valuethatUserTypeToSearch) {
//       this.WhenuserSearchItemAndDeleteIt();
//     }
//     else {
//       for (var i = 0; i < this.myordersObject.length; i++) {
//         for(var j = 0; i < this.myordersObject[i].order_descriptiion.length; i++)
//         // FruitListarray.push(this.myordersObject[i].product);
//         console.log("I "+this.myordersObject[i].order_descriptiion[i].product);
//         FruitListarray.push(this.myordersObject[i].order_descriptiion[i].product);  
//       }
//       if (valuethatUserTypeToSearch.trim()) {
//         this.myordersObject=this.currentOrderThatUserTypeForSearch;
       
//         this.myordersObject = this.myordersObject.filter((topic) => {
//           return ((topic.product.toLowerCase()).indexOf(valuethatUserTypeToSearch.toLowerCase()) !== -1);
          
//         })
//       }
//     }
//   }




//   onCancel() {
//     // this.issearchClasshtml="WithoutSearchionColProperty";
//      this.isSearchbarOperandToBeShowen = false;
//     this.myordersObject = this.currentOrderThatUserTypeForSearch;
//   }
// //   /*
// //   Used when user will typr for some text and then erase it,
// //   this function will will still make serachBar visible with all CurrentItems avaliable
// //   */
//   WhenuserSearchItemAndDeleteIt() {
//     this.isSearchbarOperandToBeShowen = true;
//    this.myordersObject = this.currentOrderThatUserTypeForSearch;
//  }


//  /*
//  This function will help user to filter User Order that can be :
//  1.Order (all type)
//  2.Order under processing (i.e on the way to be fullfilled)
//  3.Cancelled by user

 
//  */

// FilterOrder(){
//   console.log("FilterOrder_ItemsIsClicked1 "); 
//   this.navCtrl.push(FilterUserOrderPage, { content: this.ordersObject});

// }


  }


