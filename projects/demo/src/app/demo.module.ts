import { NgModule } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxTreeModule } from '@e-cloud/ngx-tree'

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
        BrowserAnimationsModule,
        DemoRoutingModule,
        NgxTreeModule.forRoot(),
    ],
    providers: [],
    bootstrap: [DemoComponent],
})
export class DemoModule {
}
