import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {LoginPage} from "../login/login";

export class RegistrationDetails {
  email: string;
  password: string;
  repeatPassword: string;
}

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  public registrationDetails: RegistrationDetails;
  public isButtonDisabled: boolean = false;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private userProvider: UserProvider
  ) {
    this.registrationDetails = new RegistrationDetails();
  }

  doRegister() {
    this.isButtonDisabled = true;
    let validationMessage = this.validateInput();

    if (!validationMessage) {
      let loader = this.loadingCtrl.create({
        content: "Registering ..."
      });
      loader.present();

      let email = this.registrationDetails.email;
      let password = this.registrationDetails.password;

      this.userProvider.signUp(email, password).then(username => {
        console.log(username + " registered.");
        loader.dismiss();
        this.isButtonDisabled = false;
      }).catch(err => {
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

  goToLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  extractErrorMessage(err) {
    if (err.code === "UsernameExistsException") {
      return "This email address is already registered.  Tap on `Already Registered` to sign in."
    } else if (err.code === "InvalidPasswordException" || err.code === "InvalidParameterException") {
      return "Your password is invalid.  Include at least 6 characters with uppercase, lowercase, and numeric characters."
    } else {
      return "An unexpected error occurred and we were not able to register you.  Please try again.  If the problem continues, please email support@mamabird.biz for assistance."
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

  validateInput() {
    let email = this.registrationDetails.email;
    let validEmail = this.validateEmail(email);
    let password1 = this.registrationDetails.password;
    let password2 = this.registrationDetails.repeatPassword;
    if (!email) {
      return "Please enter your email address."
    } else if (!validEmail) {
      return "Please enter a valid email address."
    } else if (password1 != password2) {
      return "The passwords don't match."
    } else return null;
  }

  validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}

