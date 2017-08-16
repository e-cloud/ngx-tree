import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { TreeNode } from '../../models'

@Component({
    selector: 'ngx-tree-node-drop-slot',
    templateUrl: './tree-node-drop-slot.component.html',
    styleUrls: ['./tree-node-drop-slot.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeDropSlotComponent {
    @Input() node: TreeNode
    @Input() dropIndex: number

    allowDrop = (element, $event) => this.node.options.allowDrop(element, {
        parent: this.node,
        index: this.dropIndex,
    }, $event)

    onDrop($event) {
        this.node.mouseAction('drop', $event.event, {
            from: $event.element,
            to: { parent: this.node, index: this.dropIndex },
        })
    }
}
