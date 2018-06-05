import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { IPlayer, User } from '../../../../interfaces';
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

  login() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
      });
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  getPlayer() {
    return this.toPlayerModel(this.user);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const facebook = user.providerData.find(p => p.providerId.includes('facebook'));
    const photoURL = `https://graph.facebook.com/${facebook.uid}/picture?height=300&width=300`;
    const thumbnailURL = `https://graph.facebook.com/${facebook.uid}/picture?height=100&width=100`;

    const data: User = {
      uid: user.uid,
      fullName: facebook.displayName,
      username: facebook.displayName.split(' ')[0],
      photoURL,
      thumbnailURL,
      roles: {
        player: true
      }
    };

    return userRef.set(data, { merge: true });
  }

  private toPlayerModel(user: User): IPlayer {
    return {
      uid: user.uid,
      fullName: user.fullName,
      photoURL: user.photoURL,
      thumbnailURL: user.thumbnailURL,
      captionPlayed: null,
      score: 0,
      username: user.username,
      isActive: true,
      captions: []
    };
  }
}
