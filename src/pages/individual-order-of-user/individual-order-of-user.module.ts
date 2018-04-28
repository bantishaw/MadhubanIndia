import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IndividualOrderOfUserPage } from './individual-order-of-user';

@NgModule({
  declarations: [
    IndividualOrderOfUserPage,
  ],
  imports: [
    IonicPageModule.forChild(IndividualOrderOfUserPage),
  ],
})
export class IndividualOrderOfUserPageModule {}
