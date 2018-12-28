import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {RegisterPage} from '../register/register'
import {UserProvider} from "../../providers/user/user";
import {ForgotPassPage} from "../forgot-pass/forgot-pass";

export class LoginDetails {
  email: string;
  password: string;
}

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginDetails: LoginDetails;
  public isButtonDisabled: boolean = false;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private userProvider: UserProvider) {
    this.loginDetails = new LoginDetails();
  }

  goToRegisterPage() {
    this.navCtrl.setRoot(RegisterPage);
  }

  goToForgotPassPage() {
    this.navCtrl.push(ForgotPassPage);
  }

  doLogin() {
    this.isButtonDisabled = true;
    let validationMessage = this.validateInput();

    if (!validationMessage) {
      let loader = this.loadingCtrl.create({
        content: "Signing In ..."
      });
      loader.present();

      let email = this.loginDetails.email
      let password = this.loginDetails.password;

      this.userProvider.signIn(email, password)
        .then(username => {
          console.log(username + " logged in.");
          loader.dismiss();
          this.isButtonDisabled = false;
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          loader.dismiss();
          this.isButtonDisabled = false;
          let errorMessage = this.extractErrorMessage(err);
          this.showError(errorMessage);
        });
    } else {
      this.showError(validationMessage);
      this.isButtonDisabled = false;
    }
  }

  extractErrorMessage(err) {
    if (err.code === "UserNotFoundException") {
      return "This email address isn't registered.  Tap on `Not Registered` to get started."
    } else if (err.code === "NotAuthorizedException") {
      return "Invalid email address or password.  Please try again."
    } else {
      return "An unexpected error occurred and we were not able to sign you in.  Please try again.  If the problem continues, please email support@mamabird.biz for assistance."
    }
  }

  showError(err) {
    let alert = this.alertCtrl.create({
      title: 'Oops!',
      subTitle: err,
      buttons: ['OK']
    });
    alert.present();
  }

  private validateInput() {
    let email = this.loginDetails.email;
    let password = this.loginDetails.password;
    if (!this.validateEmail(email)) {
      return "Please enter a valid email address."
    } else if (password === null || password.length === 0) {
      return "Please enter a password."
    } else return null;
  }

  private validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
