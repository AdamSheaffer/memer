import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [
    CommonModule,
    MomentModule
  ],
  declarations: [],
  exports: [MomentModule]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been imported. It should only be imported into AppModule');
    }
  }
}
