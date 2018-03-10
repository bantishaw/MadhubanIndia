import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YourOrdersPage } from './your-orders';

@NgModule({
  declarations: [
    YourOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(YourOrdersPage),
  ],
})
export class YourOrdersPageModule {}
