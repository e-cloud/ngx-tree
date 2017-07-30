import { Component, HostBinding, Input, TemplateRef } from '@angular/core'
import { TreeNode } from '../../models/tree-node'

@Component({
    moduleId: module.id,
    selector: 'ngx-tree-loading',
    templateUrl: './tree-loading.component.html',
    styleUrls: ['./tree-loading.component.scss'],
})
export class TreeLoadingComponent {
    @Input() template: TemplateRef<any>
    @Input() node: TreeNode

    @HostBinding('class.tree-loading') className = true

    constructor() {
    }
}
