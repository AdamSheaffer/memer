import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PIPES } from './pipes';
import { ClarityModule } from '@clr/angular';
import '@clr/icons';
import '@clr/icons/shapes/essential-shapes';
import '@clr/icons/shapes/social-shapes';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ...PIPES
  ],
  exports: [
    ...PIPES,
    ClarityModule
  ]
})
export class SharedModule { }
