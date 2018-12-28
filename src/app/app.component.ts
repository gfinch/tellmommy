import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {RegisterPage} from "../pages/register/register";

@Component({
  templateUrl: 'app.html'
})
export class TellMommy {
  rootPage: any = null;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      this.rootPage = RegisterPage
    });
  }
}

