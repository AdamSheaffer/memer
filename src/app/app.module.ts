import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { ClarityModule } from "@clr/angular";
import '@clr/icons';
import '@clr/icons/shapes/essential-shapes';
import '@clr/icons/shapes/social-shapes';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { GiphyService } from './services/giphy.service';
import { HeaderComponent } from './components/header/header.component';
import { GameroomComponent } from './components/gameroom/gameroom.component';
import { GameService } from './services/game.service';
import { PlayerListComponent } from './components/gameroom/player-list/player-list.component';
import { TagSelectionComponent } from './components/gameroom/tag-selection/tag-selection.component';
import { GifOptionsComponent } from './components/gameroom/gif-options/gif-options.component';
import { PlayerHandComponent } from './components/gameroom/player-hand/player-hand.component';
import { DeckService } from './services/deck.service';
import { MemeComponent } from './components/meme/meme.component';
import { ChatComponent } from './components/chat/chat.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    GameroomComponent,
    PlayerListComponent,
    TagSelectionComponent,
    GifOptionsComponent,
    PlayerHandComponent,
    MemeComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule,
    ClarityModule
  ],
  providers: [
    AuthService,
    DeckService,
    GiphyService,
    GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
