import { Component, HostBinding, Input } from '@angular/core'
import { TreeNode } from '../../models/tree-node'

@Component({
    moduleId: module.id,
    selector: 'ngx-tree-node-expander',
    templateUrl: './tree-node-expander.component.html',
    styleUrls: ['./tree-node-expander.component.scss'],
})
export class TreeNodeExpanderComponent {
    @Input() node: TreeNode

    @HostBinding('class.tree-node-expander') className = true

    constructor() {
    }
}
