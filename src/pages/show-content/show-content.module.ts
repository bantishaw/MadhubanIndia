import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowContentPage } from './show-content';

@NgModule({
  declarations: [
    ShowContentPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowContentPage),
  ],
})
export class ShowContentPageModule {}
