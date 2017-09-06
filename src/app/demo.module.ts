import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { NgxTreeModule } from 'ngx-tree'

import { DemoComponent } from './demo.component'
import { DemoRoutingModule } from './demo.routing'
import { FullWidthItemComponent } from './full-width-item/full-width-item.component'
import { SimpleComponent } from './simple/simple.component'

@NgModule({
    declarations: [
        DemoComponent,
        SimpleComponent,
        FullWidthItemComponent,
    ],
    imports: [
        BrowserModule,
        DemoRoutingModule,
        NgxTreeModule.forRoot(),
    ],
    providers: [],
    bootstrap: [DemoComponent],
})
export class DemoModule {
}
