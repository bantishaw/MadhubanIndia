import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, ToastController } from 'ionic-angular';
import { MainPage } from '../pages/pages';
import { Settings } from '../providers/providers';
import { AboutUsPage } from '../pages/about-us/about-us';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { YourOrdersPage } from '../pages/your-orders/your-orders';
import { SendFeedbackPage } from '../pages/send-feedback/send-feedback';
import { TutorialPage } from '../pages/tutorial/tutorial';
@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = TutorialPage;
  pages: Array<{ title: string, component: any }>;
  public counter = 0;
  constructor(private translate: TranslateService, platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen,
    public toastCtrl: ToastController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      platform.registerBackButtonAction(() => {
        if (this.counter == 0) {
          this.counter++;
          this.presentToast();
          setTimeout(() => { this.counter = 0 }, 3000)
        } else {
          platform.exitApp();
        }
      }, 0)
    });
    this.pages = [
      { title: 'Home', component: MainPage },
      { title: 'My Orders', component: YourOrdersPage },
      { title: 'Send Feedback', component: SendFeedbackPage },
      { title: 'About FreshPool', component: AboutUsPage },
      { title: 'Contact Us', component: ContactUsPage }
    ];
    this.initTranslate();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: "Press again back to exit",
      duration: 1000,
      position: "middle"
    });
    toast.present();
  }
}