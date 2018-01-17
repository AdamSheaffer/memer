import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'memer-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private gameService: GameService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
  }

  hostGame() {
    const user = this.authService.getUser();
    this.gameService.addGame()
      .then(ref => {
        this.router.navigate([`game/${ref.id}`]);
      });
  }

  joinGame() {
    this.gameService.findOpenGameId().subscribe(id => {
      this.router.navigate([`game/${id}`]);
    });
  }
}
