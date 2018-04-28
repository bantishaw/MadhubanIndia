import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterUserOrderPage } from './filter-user-order';

@NgModule({
  declarations: [
    FilterUserOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(FilterUserOrderPage),
  ],
})
export class FilterUserOrderPageModule {}
