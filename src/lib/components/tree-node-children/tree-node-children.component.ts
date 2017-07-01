import { animate, style, transition, trigger } from '@angular/animations'
import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core'
import { TreeNode } from '../../models/tree-node'

/** Time and timing curve for expansion panel animations. */
export const EXPANSION_PANEL_ANIMATION_TIMING = '500ms cubic-bezier(0.4,0.0,0.2,1)'

@Component({
    selector: 'ngx-tree-node-children',
    templateUrl: './tree-node-children.component.html',
    styleUrls: ['./tree-node-children.component.scss'],
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
export class TreeNodeChildrenComponent implements OnInit, OnDestroy {
    @Input() node: TreeNode
    @Input() templates: any

    constructor() {
    }

    @HostBinding('class.class.tree-children-no-padding')
    get noPadding() {
        return this.node.options.levelPadding
    }

    @HostBinding('@expandAnimation')
    get expandAnimation() {
        return this.node.isExpanded
    }

    get nodes() {
        return this.node.children
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    trackNode(index, node) {
        return node.id
    }
}
