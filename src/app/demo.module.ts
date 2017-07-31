import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { NgxTreeModule } from 'ngx-tree'

import { DemoComponent } from './demo.component'

@NgModule({
    declarations: [
        DemoComponent,
    ],
    imports: [
        BrowserModule,
        NgxTreeModule.forRoot(),
    ],
    providers: [],
    bootstrap: [DemoComponent],
})
export class DemoModule {
}
