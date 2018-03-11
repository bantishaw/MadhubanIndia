import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Settings } from '../../providers/providers';
import { Api } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settingDisplay : any;
  settingDisplayname : String;
  showChangePasswordForm : any = false;
  constructor(public navCtrl: NavController,
    public settings: Settings,
    public navParams: NavParams,
    public apiProvider: Api,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.settingDisplay = this.apiProvider.settingsInformation.settingsInformation[0];
    this.settingDisplayname = this.settingDisplay.name
  }

  mailSetting() {
    this.showChangePasswordForm = false;
    let alert = this.alertCtrl.create({
      title: 'Change email',
      subTitle: 'To change your email address, please get in touch with us at banti.shaw@outlook.com',
      buttons: ['OK']
    });
    alert.present();
  }

  changePassword() {
    this.navCtrl.push('ChangePasswordPage')
  }
  ionViewWillEnter() {
    // Build an empty form for the template to render
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }
}
