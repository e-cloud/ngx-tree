import { Component, Input, OnInit } from '@angular/core'
import { TreeNode } from '../../models/tree-node'

@Component({
    selector: 'ngx-tree-node-content-wrapper',
    templateUrl: './tree-node-content-wrapper.component.html',
    styleUrls: ['./tree-node-content-wrapper.component.scss'],
})
export class TreeNodeContentWrapperComponent implements OnInit {
    @Input() node: TreeNode
    @Input() index: number
    @Input() templates: any

    constructor() {
    }

    ngOnInit() {
    }

}
