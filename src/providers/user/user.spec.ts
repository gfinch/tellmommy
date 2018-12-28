import 'reflect-metadata';
import {anyString, instance, mock, when} from "ts-mockito";
import {AmplifyService} from "aws-amplify-angular";
import {Storage} from "@ionic/storage";
import {UserProvider} from "./user";
import {AuthClass} from "@aws-amplify/auth";

describe("User", () => {
  test("sets a familyId in storage", () => {
    let mockedAmplifyService = mock(AmplifyService);
    let mockedStorageService = mock(Storage);
    let expected = "some-family-id";
    when(mockedStorageService.set("familyId", expected))
      .thenReturn(new Promise<any>((resolve) => {
        resolve()
      }));

    let test = new UserProvider(instance(mockedAmplifyService), instance(mockedStorageService));
    return test["setFamilyId"](expected).then(familyId => {
      expect(familyId).toBe(expected);
    })
  });

  test("gets a familyId from storage", () => {
    let mockedAmplifyService = mock(AmplifyService);
    let mockedStorageService = mock(Storage);
    let expected = "some-family-id";
    when(mockedStorageService.get("familyId"))
      .thenReturn(new Promise<any>((resolve) => {
        resolve(expected)
      }));

    let test = new UserProvider(instance(mockedAmplifyService), instance(mockedStorageService));
    return test["getFamilyId"]().then(familyId => {
      expect(familyId).toBe(expected);
    })
  });

  test("creates a new familyId and sets it in storage", () => {
    let mockedAmplifyService = mock(AmplifyService);
    let mockedStorageService = mock(Storage);
    when(mockedStorageService.get("familyId"))
      .thenReturn(new Promise<any>((resolve) => {
        resolve(null)
      }));

    when(mockedStorageService.set("familyId", anyString()))
      .thenReturn(new Promise<any>((resolve) => {
        resolve()
      }));

    let test = new UserProvider(instance(mockedAmplifyService), instance(mockedStorageService));
    return test["getFamilyId"]().then(familyId => {
      expect(familyId.length).toBe(36);
    })
  });

  test("finds a family id from cognito", () => {
    let mockedAmplifyService = mock(AmplifyService);
    let mockedAuth = mock(AuthClass);
    let mockedStorageService = mock(Storage);
    let expected = "some-family-id";
    when(mockedAuth.currentUserInfo()).thenReturn(new Promise<any>((resolve) => {
      resolve({
        "attributes": {
          "profile": expected
        }
      })
    }));
    when(mockedAmplifyService.auth()).thenReturn(instance(mockedAuth));

    let test = new UserProvider(instance(mockedAmplifyService), instance(mockedStorageService));
    return test["getFamilyIdFromCognito"]().then(familyId => {
      expect(familyId).toBe(expected)
    })
  })


});
