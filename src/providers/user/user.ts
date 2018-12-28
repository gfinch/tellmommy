import {Injectable} from '@angular/core';
import {AmplifyService} from "aws-amplify-angular";
import {UUID} from "../../utilities/uuid";
import {Storage} from "@ionic/storage";
import {AuthClass} from "@aws-amplify/auth";
import {MD5} from "../../utilities/md5";

@Injectable()
export class UserProvider {

  familyId: string = null;
  username: string = null;
  auth: AuthClass = null;

  constructor(private amplify: AmplifyService,
              private storage: Storage) {
    console.log('Instantiating UserProvider');
    this.auth = this.amplify.auth();
  }

  signUp(email, password): Promise<string> {
    let username = MD5.hash(email);
    return new Promise((resolve, reject) => {
      this.getFamilyId().then(familyId => {
        console.log("Got familyId during sign up: " + familyId);
        let attributes = {
          email: email,
          profile: familyId
        };

        let request = {
          username: username,
          password: password,
          attributes: attributes
        };

        this.auth.signUp(request)
          .then(data => {
            console.log("Signup result: " + JSON.stringify(data));
            this.username = username;
            resolve(username);
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      }).catch(err => {
        console.log("Sign up error: " + JSON.stringify(err));
        reject(err);
      });
    });
  }

  signIn(email, password): Promise<string> {
    let username = MD5.hash(email);

    return new Promise((resolve, reject) => {
      this.auth.signIn(username, password).then(data => {
        console.log("Signin result: " + JSON.stringify(data));
        this.getFamilyIdFromCognito().then(familyId => {
          if (familyId) {
            this.setFamilyId(familyId)
              .then(() => resolve(username))
              .catch(err => reject(err));
          } else {
            resolve(username);
          }
        }).catch(err => {
          reject(err);
        })
      })
        .catch(err => {
          console.log("Sign in error: " + JSON.stringify(err));
          reject(err);
        });
    });
  }

  forgotPassword(email): Promise<any> {
    let username = MD5.hash(email);

    return new Promise((resolve, reject) => {
      this.auth.forgotPassword(username).then(data => {
        console.log("Forgot password result: " + JSON.stringify(data));
        resolve();
      }).catch(err => {
        console.log("Forgot password error: " + JSON.stringify(err));
        reject(err);
      });
    })
  }

  forgotPasswordSubmit(email, code, password): Promise<any> {
    let username = MD5.hash(email);

    return new Promise((resolve, reject) => {
      this.auth.forgotPasswordSubmit(username, code, password).then(data => {
        console.log("Forgot password submit result: " + JSON.stringify(data));
        resolve();
      }).catch(err => {
        console.log("Forgot password submit error: " + JSON.stringify(err));
        reject(err);
      });
    })
  }

  private getFamilyId(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.familyId) {
        resolve(this.familyId);
      } else {
        this.storage.get("familyId").then(familyId => {
          if (familyId) {
            this.familyId = familyId;
            resolve(this.familyId);
          } else {
            this.familyId = UUID.uuid();
            this.setFamilyId(this.familyId).then(
              () => resolve(this.familyId)
            ).catch(err => {
              reject(err);
            });
          }
        }).catch(err => {
          reject(err);
        })
      }
    })
  }

  private getFamilyIdFromCognito(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.auth.currentUserInfo().then(data => {
        if (data && data.attributes && data.attributes.profile) {
          console.log("Found family id in Cognito: " + data.attributes.profile);
          resolve(data.attributes.profile);
        } else {
          resolve(null);
        }
      }).catch(err => {
        console.log(err);
        reject(err);
      })
    })
  }

  private setFamilyId(familyId) {
    return new Promise((resolve, reject) => {
      this.familyId = familyId;
      this.storage.set("familyId", familyId)
        .then(() => resolve(familyId))
        .catch(err => reject(err));
    })

  }
}
