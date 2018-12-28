import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {LoginPage} from "../login/login";
import {RegisterPage} from "../register/register";

export class ForgotPassDetails {
  email: string;
  code: string;
  password: string;
  repeatPassword: string;
}

@IonicPage()
@Component({
  selector: 'page-forgot-pass',
  templateUrl: 'forgot-pass.html',
})
export class ForgotPassPage {

  public forgotPassDetails: ForgotPassDetails;
  public isButtonDisabled: boolean = false;
  public hasCodeBeenSent: boolean = false;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private userProvider: UserProvider) {
    this.forgotPassDetails = new ForgotPassDetails();
  }

  buttonText() {
    if (this.hasCodeBeenSent) return "Reset Password";
    else return "Send Code";
  }

  goToLoginPage() {
    this.hasCodeBeenSent = false;
    this.navCtrl.push(LoginPage);
  }

  goToRegisterPage() {
    this.hasCodeBeenSent = false;
    this.navCtrl.push(RegisterPage);
  }

  doResetPassword() {
    this.isButtonDisabled = true;
    if (this.hasCodeBeenSent) {
      let validationMessage = this.validateInput();
      if (!validationMessage) {
        let email = this.forgotPassDetails.email;
        let password = this.forgotPassDetails.password;
        let code = this.forgotPassDetails.code;
        this.userProvider.forgotPasswordSubmit(email, code, password).then(() => {
          this.showAlert("Success!", "You successfully changed your password.");
        }).catch(err => {
          let errorMessage = this.extractErrorMessage(err);
          this.showError(errorMessage);
          this.isButtonDisabled = false;
        })
      } else {
        this.showError(validationMessage);
        this.isButtonDisabled = false;
      }
    } else {
      if (this.validateEmail(this.forgotPassDetails.email)) {
        this.userProvider.forgotPassword(this.forgotPassDetails.email).then(() => {
          this.hasCodeBeenSent = true;
          this.showAlert("Check your email!", "We just sent you an email.  Get the verification code from the email, then come back here to reset your password.")
          this.isButtonDisabled = false;
        }).catch(err => {
          let errorMessage = this.extractErrorMessage(err);
          this.showError(errorMessage);
          this.isButtonDisabled = false;
        })
      } else {
        let errorMessage = "Please enter a valid email address.";
        this.showError(errorMessage);
        this.isButtonDisabled = false;
      }
    }
  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  showError(err) {
    this.showAlert("Oops!", err);
  }

  extractErrorMessage(err) {
    if (err.code === "UserNotFoundException") {
      return "This email address isn't registered.  Tap on `Not Registered` to register."
    } else if (err.code === "UsernameExistsException") {
      return "This email address is already registered.  Tap on `Already Registered` to sign in."
    } else if (err.code === "InvalidPasswordException" || err.code === "InvalidParameterException") {
      return "Your password is invalid.  Include at least 6 characters with uppercase, lowercase, and numeric characters."
    } else if (err.code === "NotAuthorizedException") {
      return "Invalid email address or password.  Please try again."
    } else if (err.code === "CodeMismatchException") {
      return "The verification code you entered is invalid.  Please try again."
    } else if (err.code === "LimitExceededException") {
      return "You've reached the limit on the number of verification codes we can send you for now.  Try again in a couple of hours."
    } else {
      return "An unexpected error occurred and we were not able to sign you in.  Please try again.  If the problem continues, please email support@mamabird.biz for assistance."
    }
  }

  validateInput() {
    let email = this.forgotPassDetails.email;
    let validEmail = this.validateEmail(email);
    let code = this.forgotPassDetails.code;
    let password1 = this.forgotPassDetails.password;
    let password2 = this.forgotPassDetails.repeatPassword;
    if (!email) {
      return "Please enter your email address."
    } else if (!validEmail) {
      return "Please enter a valid email address."
    } else if (code === null || code === "") {
      return "Please enter the password reset code you found in your email."
    } else if (password1 != password2) {
      return "The passwords don't match."
    } else return null;
  }

  private validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
