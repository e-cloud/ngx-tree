import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import isFunction from 'lodash-es/isFunction'
import { TreeNode, TreeUIOptions } from '../../models'

@Component({
    selector: 'ngx-tree-node-drop-slot',
    templateUrl: './tree-node-drop-slot.component.html',
    styleUrls: ['./tree-node-drop-slot.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeDropSlotComponent {
    @Input() node: TreeNode
    @Input() options: TreeUIOptions
    @Input() dropIndex: number

    allowDrop = (element, $event) =>
        isFunction(this.options.allowDrop)
            ? this.options.allowDrop(element, {
                parent: this.node,
                index: this.dropIndex,
            }, $event)
            : false

    onDrop($event) {
        this.node.mouseAction('drop', $event.event, {
            from: $event.element,
            to: { parent: this.node, index: this.dropIndex },
        })
    }
}
