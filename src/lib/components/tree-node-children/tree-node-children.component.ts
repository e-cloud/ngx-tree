import { Component, Input, OnInit } from '@angular/core'
import { TreeNode } from '../../models/tree-node'

@Component({
    selector: 'ngx-tree-node-children',
    templateUrl: './tree-node-children.component.html',
    styleUrls: ['./tree-node-children.component.scss'],
})
export class TreeNodeChildrenComponent implements OnInit {
    @Input() node: TreeNode
    @Input() templates: any

    constructor() {
    }

    ngOnInit() {
    }

}
