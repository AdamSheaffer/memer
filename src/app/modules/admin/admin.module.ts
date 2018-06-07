import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { COMPONENTS } from './components';
import { SharedModule } from '../shared/shared.module';
import { CaptionEditComponent } from './components/caption-edit/caption-edit.component';
import { CaptionAddComponent } from './components/caption-add/caption-add.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  declarations: [
    ...COMPONENTS,
    CaptionEditComponent,
    CaptionAddComponent
  ]
})
export class AdminModule { }
