import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogOutPage } from './log-out';

@NgModule({
  declarations: [
    LogOutPage,
  ],
  imports: [
    IonicPageModule.forChild(LogOutPage),
  ],
})
export class LogOutPageModule {}
