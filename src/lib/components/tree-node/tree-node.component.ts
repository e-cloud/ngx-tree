import { animate, style, transition, trigger } from '@angular/animations'
import { Component, HostBinding, Input } from '@angular/core'
import { TreeNode } from '../../models/tree-node'

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
    @Input() index: number
    @Input() templates: any

    @HostBinding('class.tree-node') className = true

    @HostBinding('class')
    get nodeClass() {
        return this.node.cssClass
    }

    @HostBinding('class.tree-node-expanded')
    get expandClass() {
        return this.node.isExpanded
    }

    @HostBinding('class.tree-node-collapsed')
    get collapseClass() {
        return this.node.isCollapsed
    }

    @HostBinding('class.tree-node-leaf')
    get leafClass() {
        return this.node.isLeaf
    }

    @HostBinding('class.tree-node-active')
    get activeClass() {
        return this.node.isActive
    }

    @HostBinding('class.tree-node-focused')
    get focuseClass() {
        return this.node.isFocused
    }

    constructor() {
    }
}
