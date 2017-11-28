import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgtoPasswordPage } from './forgto-password';
import { EmailComposer } from '@ionic-native/email-composer';

@NgModule({
  declarations: [
    ForgtoPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgtoPasswordPage),
  ],
  providers:[
    EmailComposer
  ],
})
export class ForgtoPasswordPageModule {} 
