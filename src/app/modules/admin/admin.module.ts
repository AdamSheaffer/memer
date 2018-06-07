import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { COMPONENTS } from './components';
import { SharedModule } from '../shared/shared.module';
import { CaptionEditComponent } from './components/caption-edit/caption-edit.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  declarations: [
    ...COMPONENTS,
    CaptionEditComponent
  ]
})
export class AdminModule { }
