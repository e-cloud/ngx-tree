import { Component, Input, OnInit } from '@angular/core'
import { TreeNode } from '../../models/tree-node'
import { TreeModel } from '../../services/tree-model.service'
import { TreeVirtualScroll } from '../../services/tree-virtual-scroll.service'

@Component({
    selector: 'ngx-tree-node-collection',
    templateUrl: './tree-node-collection.component.html',
    styleUrls: ['./tree-node-collection.component.scss'],
})
export class TreeNodeCollectionComponent implements OnInit {
    @Input() nodes
    @Input() treeModel: TreeModel
    @Input() templates
    viewportNodes: TreeNode[]

    private virtualScroll: TreeVirtualScroll // Cannot inject this, because we might be inside treeNodeTemplateFull

    constructor() {
    }

    get marginTop(): string {
        const firstNode = this.viewportNodes && this.viewportNodes.length && this.viewportNodes[0]
        const relativePosition = firstNode
            ? firstNode.position - firstNode.parent.position - firstNode.parent.getSelfHeight()
            : 0

        return `${relativePosition}px`
    }

    ngOnInit() {
        this.virtualScroll = null
    }


    trackNode(index, node) {
        return node.id
    }
}
