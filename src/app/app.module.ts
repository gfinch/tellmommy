import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {TellMommy} from './app.component';

import {AmplifyAngularModule, AmplifyService} from 'aws-amplify-angular';
import {TransactionProvider} from '../providers/transaction/transaction';
import {UserProvider} from '../providers/user/user';
import {IonicStorageModule} from "@ionic/storage";
import {RegisterPage} from "../pages/register/register";
import {LoginPage} from "../pages/login/login";
import {ForgotPassPage} from "../pages/forgot-pass/forgot-pass";

@NgModule({
  declarations: [
    TellMommy,
    RegisterPage,
    LoginPage,
    ForgotPassPage
  ],
  imports: [
    BrowserModule,
    AmplifyAngularModule,
    IonicModule.forRoot(TellMommy),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    TellMommy,
    RegisterPage,
    LoginPage,
    ForgotPassPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AmplifyService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TransactionProvider,
    UserProvider
  ]
})
export class AppModule {
}
