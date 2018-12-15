import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { Player, User } from '../../../../interfaces';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;
  private user: User;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    //// Get auth data, then get firestore user document || null
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );

    this.user$.subscribe(u => this.user = u);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        return this.updateUserData(credential.user);
      });
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  getPlayer() {
    return this.toPlayerModel(this.user);
  }

  private getUserDataFromFacebookProvider(credentialUser, provider): User {
    const photoURL = `https://graph.facebook.com/${provider.uid}/picture?height=300&width=300`;
    const thumbnailURL = `https://graph.facebook.com/${provider.uid}/picture?height=100&width=100`;

    return {
      photoURL,
      thumbnailURL,
      uid: credentialUser.uid,
      fullName: provider.displayName,
      username: provider.displayName.split(' ')[0],
      roles: {
        player: true
      }
    };
  }

  private getUserDataFromGoogleProvider(credentialUser, provider): User {
    return {
      photoURL: provider.photoURL,
      thumbnailURL: provider.photoURL,
      uid: credentialUser.uid,
      fullName: provider.displayName,
      username: provider.displayName.split(' ')[0],
      roles: {
        player: true
      }
    };
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const facebook = user.providerData.find(p => p.providerId.includes('facebook'));
    const google = user.providerData.find(p => p.providerId.includes('google.com'));
    let data: User;

    // try facebook first
    if (facebook) {
      data = this.getUserDataFromFacebookProvider(user, facebook);
    } else {
      data = this.getUserDataFromGoogleProvider(user, google);
    }

    return userRef.set(data, { merge: true });
  }

  private toPlayerModel(user: User): Player {
    return {
      uid: user.uid,
      fullName: user.fullName,
      photoURL: user.photoURL,
      thumbnailURL: user.thumbnailURL,
      captionPlayed: null,
      score: 0,
      username: user.username,
      isActive: true,
      roles: user.roles
    };
  }

  canPlay(user: User) {
    const allowedRoles = ['admin', 'editor', 'player'];
    return this.checkAuthorization(user, allowedRoles);
  }

  canModify(user: User) {
    const allowedRoles = ['admin', 'editor'];
    return this.checkAuthorization(user, allowedRoles);
  }

  canApprove(user: User) {
    const allowedRoles = ['admin'];
    return this.checkAuthorization(user, allowedRoles);
  }

  private checkAuthorization(user: User, allowedRoles: string[]) {
    if (!user) { return false; }

    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }
    return false;
  }

}
