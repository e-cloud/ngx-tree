import { Component, Input, OnInit } from '@angular/core'
import { TreeNode } from '../../models/tree-node'

@Component({
    selector: 'ngx-tree-node',
    templateUrl: './tree-node.component.html',
    styleUrls: ['./tree-node.component.scss'],
})
export class TreeNodeComponent implements OnInit {
    @Input() node: TreeNode
    @Input() index: number
    @Input() templates: any

    constructor() {
    }

    ngOnInit() {
    }
}
