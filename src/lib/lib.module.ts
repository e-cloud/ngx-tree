import { CommonModule } from '@angular/common'
import { ModuleWithProviders, NgModule } from '@angular/core'
import { TreeLoadingComponent } from './components/tree-loading/tree-loading.component'
import { TreeNodeChildrenComponent } from './components/tree-node-children/tree-node-children.component'
import { TreeNodeCollectionComponent } from './components/tree-node-collection/tree-node-collection.component'
import { TreeNodeContentWrapperComponent } from './components/tree-node-content-wrapper/tree-node-content-wrapper.component'
import { TreeNodeContentComponent } from './components/tree-node-content/tree-node-content.component'
import { TreeNodeExpanderComponent } from './components/tree-node-expander/tree-node-expander.component'
import { TreeNodeComponent } from './components/tree-node/tree-node.component'
import { TreeViewportComponent } from './components/tree-viewport/tree-viewport.component'
import { TreeComponent } from './components/tree/tree.component'

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        TreeLoadingComponent,
        TreeNodeComponent,
        TreeComponent,
        TreeNodeExpanderComponent,
        TreeNodeCollectionComponent,
        TreeNodeContentWrapperComponent,
        TreeNodeChildrenComponent,
        TreeNodeContentComponent,
        TreeViewportComponent,
    ],
    exports: [],
})
export class NgxTreeModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgxTreeModule,
            providers: [],
        }
    }
}
