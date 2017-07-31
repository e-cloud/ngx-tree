import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'
import { TreeNode } from '../../models'
import { TreeVirtualScroll } from '../../services/tree-virtual-scroll.service'
import { binarySearch } from '../../util'

/** Time and timing curve for expansion panel animations. */
export const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)'

@Component({
    selector: 'ngx-tree-node-children',
    templateUrl: './tree-node-children.component.html',
    styleUrls: ['./tree-node-children.component.scss'],
    /*animations: [
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
    ],*/
})
export class TreeNodeChildrenComponent implements OnInit, OnDestroy {
    marginTop = 0

    @Input() node: TreeNode
    @Input() templates: any
    @Input() disableMarginTop = false

    /*@HostBinding('@expandAnimation')
    expandAnimation = true*/

    private scrollSub: Subscription
    private _viewportNodes: TreeNode[] = []

    constructor(private virtualScroll: TreeVirtualScroll) {
    }

    @HostBinding('class.class.tree-children-no-padding')
    get noPadding() {
        return this.node.options.levelPadding
    }

    @HostBinding('style.margin-top.px')
    get marginTopAttr() {
        return this.disableMarginTop ? 0 : this.marginTop
    }

    get nodes() {
        return this.node.children
    }

    get viewportNodes() {
        return this.virtualScroll.isDisabled() ? this.nodes : this._viewportNodes
    }

    ngOnInit() {
        this._viewportNodes = this.nodes
        this.scrollSub = this.virtualScroll.waitForCollection((metrics) => {
            if (this.node.isExpanded) {
                this._viewportNodes = this.getViewportNodes(this.nodes, metrics)
                this.marginTop = this.calcMarginTop()
            }
        })
    }

    ngOnDestroy() {
        this.scrollSub.unsubscribe()
    }

    trackNode(index, node) {
        return node.id
    }

    calcMarginTop() {
        const firstNode = this.viewportNodes && this.viewportNodes.length && this.viewportNodes[0]

        // condition on root node is because the virtual root's self height is 0
        return firstNode
            ? Math.max(0, firstNode.position - firstNode.parent.position -
                (firstNode.parent.isRoot ? 0 : this.virtualScroll.averageNodeHeight))
            : 0
    }

    getViewportNodes(nodes: TreeNode[], { startPos, endPos }) {
        if (!nodes) {
            return []
        }

        // Search for first node in the viewport using binary search
        // Look for first node that starts after the beginning of the viewport (with buffer)
        // Or that ends after the beginning of the viewport
        const firstIndex = binarySearch(nodes, (node) => {
            return startPos <= node.position || (startPos <= node.position + node.height)
        })

        // Search for last node in the viewport using binary search
        // Look for first node that starts after the end of the viewport (with buffer)
        const lastIndex = binarySearch(nodes, (node) => {
            return endPos < node.position || (endPos <= node.position + node.height)
        }, firstIndex)

        const viewportNodes = nodes.slice(firstIndex, lastIndex + 1)

        // console.log(this.node.id, 'first: ', firstIndex, 'last: ', lastIndex, viewportNodes)

        return viewportNodes
    }
}
