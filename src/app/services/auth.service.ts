
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { IPlayer } from '../interfaces/IPlayer';

@Injectable()
export class AuthService {

  private user: IPlayer;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.pipe(
      map(this.toPlayerModel))
      .subscribe(user => {
        this.user = user;
      });
  }

  login(): Promise<firebase.User> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  authState(): Observable<IPlayer> {
    return this.afAuth.authState.pipe(map(this.toPlayerModel));
  }

  getUser(): IPlayer {
    return this.user;
  }

  private toPlayerModel(fbuser: firebase.User): IPlayer {
    if (!fbuser) { return null; }

    const facebook = fbuser.providerData.find(p => p.providerId.includes('facebook'));
    const photoURL = `https://graph.facebook.com/${facebook.uid}/picture?height=300&width=300`;
    const thumbnailURL = `https://graph.facebook.com/${facebook.uid}/picture?height=150&width=150`;

    return {
      fullName: fbuser.displayName,
      uid: fbuser.uid,
      username: facebook.displayName.split(' ')[0],
      isActive: true,
      score: 0,
      captions: [],
      photoURL,
      thumbnailURL
    };
  }
}
