import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DemoComponent } from './demo.component';
import { NgxTreeModule } from 'ngx-tree';

@NgModule({
  declarations: [
      DemoComponent,
  ],
  imports: [
    BrowserModule,
    NgxTreeModule
  ],
  providers: [],
  bootstrap: [DemoComponent]
})
export class DemoModule { }
