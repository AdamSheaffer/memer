import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router/';
import { AuthService } from '../../modules/core/services';

@Component({
  selector: 'memer-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  facebookLogin() {
    this.authService.facebookLogin().then(u => {
      this.router.navigate(['/']);
    });
  }

  googleLogin() {
    this.authService.googleLogin().then(u => {
      this.router.navigate(['/']);
    });
  }
}
