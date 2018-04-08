import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Header } from 'ionic-angular/components/toolbar/toolbar-header';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string = 'http://localhost:8080/userRegistration';
  data: any;
  settingsInformation: any;
  shoppingCartData: any;
  constructor(public http: Http) {
    this.data = null;
  }
  getDataToDisplay() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.get('http://localhost:8080/userRegistration', { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  userLogin(userObject) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post('http://localhost:8080/getLogin', userObject, { headers: headers })
        .subscribe(res => {
          this.settingsInformation = res.json();
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  newUserSignUp(account) {
    console.log("provider page for sign up", account)
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post('http://localhost:8080/newUserSignUp', account, { headers: headers })
        .subscribe(res => {
          this.settingsInformation = res.json();
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  forgotPassword(credentials) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post('http://localhost:8080/forgotPassword', credentials, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err)
        })
    })
  }

  saveNewSettingsPassword(credentials) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post('http://localhost:8080/saveNewSettingsPassword', credentials, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err)
        })
    })
  }

  submitFeedback(userFeedback) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post('http://localhost:8080/submitFeedback', userFeedback, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err)
        })
    })
  }

  contactUs(queryDoc) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post('http://localhost:8080/contactUs', queryDoc, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err)
        })
    })
  }

  getMyOrders(queryDoc) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post('http://localhost:8080/getMyOrders', queryDoc, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          console.log(err)
          reject(err)
        })
    })
  }

  getAboutUsPage() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.get('http://localhost:8080/getAboutUsMethod', { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err)
        });
    });
  }


  getHomeMenuService() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.get('http://localhost:8080/getHomePageServiceMenu', { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err)
        });
    });
  }

  getSubMenuItems(subMenuObject) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post('http://localhost:8080/getSubMenuCollection', subMenuObject, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err)
        });
    });
  }

  addToCart(cartObject) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post('http://localhost:8080/addToCart', cartObject, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err)
        });
    });
  }

  queryCartlength(cartLengthObject) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post('http://localhost:8080/queryCartLength', cartLengthObject, { headers: headers })
        .subscribe(res => {
          this.shoppingCartData = res.json();
          resolve(res.json());
        }, (err) => {
          reject(err)
        });
    });
  }

  getHomePageSlidingImages() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.get('http://localhost:8080/getHomePageSlidingImages', { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err)
        });
    });
  }

  removeItemFromCart(removeItem) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post('http://localhost:8080/removeItemFromCart', removeItem, { headers: headers })
        .subscribe(res => {
          this.shoppingCartData = res.json();
          resolve(res.json());
        }, (err) => {
          reject(err)
        });
    });
  }
  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params.set(k, params[k]);
      }
    }
    console.log("this is url " + this.url);

    return this.http.get(this.url, reqOpts);

    // return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }
}
