import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router/';
import { UserService } from '../../modules/core/services';

@Component({
  selector: 'memer-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  facebookLogin() {
    this.userService.facebookLogin().then(u => {
      this.router.navigate(['/']);
    });
  }

  googleLogin() {
    this.userService.googleLogin().then(u => {
      this.router.navigate(['/']);
    });
  }
}
