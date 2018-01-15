import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  private user: firebase.User;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => { this.user = user });
  }

  login(): Promise<firebase.User> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  isLoggedIn(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  getUser(): firebase.User {
    return this.user;
  }

}
