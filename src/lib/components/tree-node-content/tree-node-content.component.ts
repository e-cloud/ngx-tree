import { Component, Input, OnInit, TemplateRef } from '@angular/core'
import { TreeNode } from '../../models/tree-node'

@Component({
    selector: 'ngx-tree-node-content',
    templateUrl: './tree-node-content.component.html',
    styleUrls: ['./tree-node-content.component.scss'],
})
export class TreeNodeContentComponent implements OnInit {
    @Input() node: TreeNode
    @Input() index: number
    @Input() template: TemplateRef<any>

    constructor() {
    }

    ngOnInit() {
    }

}
