import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { IPlayer } from '../interfaces/IPlayer';

@Injectable()
export class AuthService {

  private user: IPlayer;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState
      .map(this.toPlayerModel)
      .subscribe(user => {
        this.user = user;
      });
  }

  login(): Promise<firebase.User> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  authState(): Observable<IPlayer> {
    return this.afAuth.authState.map(this.toPlayerModel);
  }

  getUser(): IPlayer {
    return this.user;
  }

  private toPlayerModel(fbuser: firebase.User): IPlayer {
    if (!fbuser) return null;
    return {
      fullName: fbuser.displayName,
      uid: fbuser.uid,
      photoURL: fbuser.photoURL,
      username: fbuser.displayName.split(' ')[0],
      isActive: true,
      isHost: false
    }
  }
}
