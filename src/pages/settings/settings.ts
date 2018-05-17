import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Settings } from '../../providers/providers';
import { Api } from '../../providers/providers';
import { App } from 'ionic-angular';
import { LoginPage } from '../login/login'
import { TutorialPage } from '../tutorial/tutorial';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settingDisplay: any;
  settingDisplayname: String;
  showChangePasswordForm: any = false;
  deleteUserResult: any;
  constructor(public navCtrl: NavController,
    public settings: Settings,
    public navParams: NavParams,
    public apiProvider: Api,
    private alertCtrl: AlertController,
    public appCtrl: App, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
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

  doLogout() {
    let confirm = this.alertCtrl.create({
      title: 'Logout !',
      message: 'Are you Sure you want to Logout ?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.push(LoginPage)
          }
        },
        {
          text: 'No',
          handler: () => {
            console.log("User don't want to logout")
          }
        }
      ]
    });
    confirm.present()
  }

  deleteUser() {
    let prompt = this.alertCtrl.create({
      title: 'Deactivate Account',
      message: `
        <p style="text-align: start;">Email ID : ${this.settingDisplay.email}</p>
        <p style="text-align: start;">Mobile Number : ${this.settingDisplay.phoneNumber}</p>
        <p>If you deactivate your account</p>
        <ul>
          <li style="text-align: start;">We will miss you</li>
          <li style="text-align: start;">All the past orders will be lost</li>
          <li style="text-align: start;">You won't receive the new updates from us</li>
        </ul>
      `,
      inputs: [
        {
          name: 'Password',
          placeholder: 'Please confirm with your password'
        },
      ],
      buttons: [
        {
          text: 'CANCEL',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'CONFIRM',
          handler: data => {
            let loading = this.loadingCtrl.create({
              spinner: 'crescent',
              cssClass: "wrapper"
            });
            let deleteObject = {
              email: this.settingDisplay.email
            }
            if (data.Password === this.settingDisplay.password) {
              loading.present();
              this.apiProvider.deleteUser(deleteObject).then((result) => {
                this.deleteUserResult = result;
                if (this.deleteUserResult.response === "success") {
                  loading.dismiss();
                  this.toastMessage(this.deleteUserResult.data)
                  setTimeout(() => {
                    this.navCtrl.push(TutorialPage);
                  }, 1000);
                }
              })
            } else {
              this.toastMessage("Please enter the correct password")
            }
          }
        }
      ]
    });
    prompt.present();
  }

  toastMessage(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'middle',
      cssClass: 'showToast'
    });
    toast.present();
  }

}
