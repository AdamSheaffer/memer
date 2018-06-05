import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PIPES } from './pipes';
import { COMPONENTS } from './components';
import { SharedModule } from '../shared/shared.module';
import { GameRoutingModule } from './game-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    GameRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...PIPES
  ]
})
export class GameModule { }
