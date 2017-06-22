import { Component, Input, OnInit } from '@angular/core'
import { TreeNode } from '../../models/tree-node'

@Component({
    selector: 'ngx-tree-node-expander',
    templateUrl: './tree-node-expander.component.html',
    styleUrls: ['./tree-node-expander.component.scss'],
})
export class TreeNodeExpanderComponent implements OnInit {

    @Input() node: TreeNode

    constructor() {
    }

    ngOnInit() {
    }

}
