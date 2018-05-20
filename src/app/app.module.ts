
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { Items } from '../mocks/providers/items';
import { Settings } from '../providers/providers';
import { User } from '../providers/providers';
import { Api } from '../providers/providers';
import { MyApp } from './app.component';
import { AboutUsPage } from '../pages/about-us/about-us';
import { YourOrdersPage } from '../pages/your-orders/your-orders';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { ListMasterPage } from '../pages/list-master/list-master';
import { Geolocation } from '@ionic-native/geolocation';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { SendFeedbackPage } from '../pages/send-feedback/send-feedback';
import { ShowContentPage } from '../pages/show-content/show-content';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ShoppingCartPage } from '../pages/shopping-cart/shopping-cart';
import { IndividualOrderOfUserPage } from '../pages/individual-order-of-user/individual-order-of-user';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp,
    AboutUsPage,
    YourOrdersPage,
    ContactUsPage,
    SendFeedbackPage,
    TutorialPage,
    LoginPage,
    SignupPage,
    ListMasterPage,
    ShowContentPage,
    ShoppingCartPage,
    IndividualOrderOfUserPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp, { scrollAssist: false, autoFocusAssist: false, tabsHideOnSubPages: true }, ),
    IonicStorageModule.forRoot()],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutUsPage,
    YourOrdersPage,
    ContactUsPage,
    SendFeedbackPage,
    TutorialPage,
    LoginPage,
    SignupPage,
    ListMasterPage,
    ShowContentPage,
    ShoppingCartPage,
    IndividualOrderOfUserPage

  ],
  providers: [
    Api,
    Items,
    User,
    Camera,
    SplashScreen,
    StatusBar,
    SocialSharing,
    Geolocation,
    LocationAccuracy,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
