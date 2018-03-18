import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendFeedbackPage } from './send-feedback';

@NgModule({
  declarations: [
    SendFeedbackPage,
  ],
  imports: [
    IonicPageModule.forChild(SendFeedbackPage),
  ],
})
export class SendFeedbackPageModule {}
