import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FullWidthItemComponent } from './full-width-item/full-width-item.component'
import { SimpleComponent } from './simple/simple.component'

export const routes: Routes = [
    {
        path: '',
        component: SimpleComponent,
    },
    {
        path: 'full-width-item',
        component: FullWidthItemComponent,
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [],
})
export class DemoRoutingModule {
}
