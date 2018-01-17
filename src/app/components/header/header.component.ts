import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router/';

@Component({
  selector: 'memer-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  username: string;

  constructor(private authService: AuthService, private router: Router) {
    this.username = this.authService.getUser().username;
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout().then(() => this.router.navigate(['login']));
  }
}
