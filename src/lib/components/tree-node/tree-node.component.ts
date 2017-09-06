import { animate, style, transition, trigger } from '@angular/animations'
import { Component, HostBinding, Input } from '@angular/core'
import isFunction from 'lodash-es/isFunction'
import { TreeNode, TreeUIOptions } from '../../models'

export const EXPANSION_PANEL_ANIMATION_TIMING = '500ms cubic-bezier(0.4,0.0,0.2,1)'

@Component({
    selector: 'ngx-tree-node',
    templateUrl: './tree-node.component.html',
    styleUrls: ['./tree-node.component.scss'],
    animations: [
        trigger('expandAnimation', [
            transition(':enter', [
                style({ height: 0, overflow: 'hidden' }),
                animate(EXPANSION_PANEL_ANIMATION_TIMING, style({ height: '*' })),
            ]),
            transition(':leave', [
                style({ height: '*', overflow: 'hidden' }),
                animate(EXPANSION_PANEL_ANIMATION_TIMING, style({ height: 0 })),
            ]),
        ]),
    ],
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
