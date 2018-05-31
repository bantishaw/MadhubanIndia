import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController, MenuController } from 'ionic-angular';
import { Api } from '../../providers/providers';
import { User } from '../../providers/providers';
import { Http, Headers } from '@angular/http';
import { MainPage } from '../pages';
import { SignupPage } from '../signup/signup';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    existingUser: any;
    email: string;
    password: string;
    isActiveToggleTextPassword: Boolean = true;
    showPasswordEye: Boolean = true;
    constructor(
        private menu: MenuController,
        public navCtrl: NavController,
        public user: User,
        public toastCtrl: ToastController,
        public translateService: TranslateService,
        public apiProvider: Api,
        public http: Http,
        public loadingCtrl: LoadingController) { }

    ionViewDidEnter() {
        this.menu.swipeEnable(false);
    }

    ionViewWillLeave() {
        this.menu.swipeEnable(true);
    }

    doLogin() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var userObject = {
            email: this.email,
            password: this.password
        }
        if (!userObject.email) {
            this.toastMessage("Email address cannot be empty")
        } else if (!userObject.password) {
            this.toastMessage("Password cannot be empty")
        } else {
            let loading = this.loadingCtrl.create({
                spinner: 'crescent',
                cssClass: "wrapper"
            });
            loading.present();
            this.apiProvider.userLogin(userObject).then((data) => {
                this.existingUser = data;
                if (this.existingUser.response === 'success') {
                    loading.dismiss();
                    setTimeout(() => {
                        window.localStorage.setItem('password', this.password);
                        window.localStorage.setItem('username', this.email);
                        this.navCtrl.push(MainPage);
                    }, 500);
                } else {
                    loading.dismiss();
                    setTimeout(() => {
                        this.toastMessage(this.existingUser.data)
                    }, 500);
                }
            })
        }
    }

    newUserRegister() {
        this.navCtrl.push(SignupPage);
    }

    forgotPassword() {
        this.navCtrl.push('ForgtoPasswordPage')
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

    toggleTextPassword() {
        this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword == true) ? false : true;
        this.showPasswordEye = (this.showPasswordEye == true) ? false : true;
    }
    getType() {
        return this.isActiveToggleTextPassword ? 'password' : 'text';
    }

    hideAndShow() {
        return this.showPasswordEye ? 'eye' : 'eye-off';
    }
}