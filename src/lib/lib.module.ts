import { CommonModule } from '@angular/common'
import { ModuleWithProviders, NgModule } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TreeNodeDropSlotComponent } from 'ngx-tree/components/tree-node-drop-slot/tree-node-drop-slot.component'
import { TreeDragDirective } from 'ngx-tree/directives/tree-drag.directive'
import { TreeDropDirective } from 'ngx-tree/directives/tree-drop.directive'
import { TreeDraggingTargetService } from 'ngx-tree/services/tree-dragging-target.service'
import { TreeLoadingComponent } from './components/tree-loading/tree-loading.component'
import { TreeNodeChildrenComponent } from './components/tree-node-children/tree-node-children.component'
import { TreeNodeContentComponent } from './components/tree-node-content/tree-node-content.component'
import { TreeNodeExpanderComponent } from './components/tree-node-expander/tree-node-expander.component'
import { TreeNodeWrapperComponent } from './components/tree-node-wrapper/tree-node-wrapper.component'
import { TreeNodeComponent } from './components/tree-node/tree-node.component'
import { TreeViewportComponent } from './components/tree-viewport/tree-viewport.component'
import { TreeComponent } from './components/tree/tree.component'

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
    ],
    declarations: [
        TreeLoadingComponent,
        TreeNodeComponent,
        TreeComponent,
        TreeNodeExpanderComponent,
        TreeNodeWrapperComponent,
        TreeNodeChildrenComponent,
        TreeNodeContentComponent,
        TreeViewportComponent,
        TreeNodeDropSlotComponent,
        TreeDragDirective,
        TreeDropDirective,
    ],
    exports: [
        TreeLoadingComponent,
        TreeNodeComponent,
        TreeComponent,
        TreeNodeExpanderComponent,
        TreeNodeWrapperComponent,
        TreeNodeChildrenComponent,
        TreeNodeContentComponent,
        TreeViewportComponent,
        TreeNodeDropSlotComponent,
        TreeDragDirective,
        TreeDropDirective,
    ],
})
export class NgxTreeModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgxTreeModule,
            providers: [
                TreeDraggingTargetService,
            ],
        }
    }
}
