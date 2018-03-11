import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Settings } from '../../providers/providers';
import { Api } from '../../providers/providers';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
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
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    public apiProvider: Api,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    console.log("came to settings page",this.apiProvider.settingsInformation)
    this.settingDisplay = this.apiProvider.settingsInformation.settingsInformation[0];
    this.settingDisplayname = this.settingDisplay.name
    console.log("disply",this.settingDisplayname)

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
    console.log("show password page")
    this.navCtrl.push('ChangePasswordPage')
  }
  ionViewWillEnter() {
    // Build an empty form for the template to render
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }
}
