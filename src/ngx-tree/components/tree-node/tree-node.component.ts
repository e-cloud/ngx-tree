import { Component, HostBinding, Input } from '@angular/core'
import isFunction from 'lodash-es/isFunction'
import { TreeNode, TreeUIOptions } from '../../models'

@Component({
    selector: 'ngx-tree-node',
    templateUrl: './tree-node.component.html',
    styleUrls: ['./tree-node.component.scss'],
})
export class TreeNodeComponent {
    @Input() node: TreeNode
    @Input() options: TreeUIOptions
    @Input() index: number
    @Input() templates: any

    @HostBinding('class.tree-node') className = true

    allowDrag(node: TreeNode) {
        return isFunction(this.options.allowDrag) ? this.options.allowDrag(node) : this.options.allowDrag
    }

    allowDrop(node: TreeNode, $event?: DragEvent) {
        return isFunction(this.options.allowDrop)
            ? this.options.allowDrop(node, { parent: this.node, index: node.index }, $event)
            : this.options.allowDrop
    }
}
