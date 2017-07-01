import { Component, HostBinding, Input, OnInit, TemplateRef } from '@angular/core'
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

    @HostBinding('class.tree-node-content') className = true

    constructor() {
    }

    @HostBinding('class.tree-node-content-active')
    get activeClass() {
        return this.node.isActive
    }

    @HostBinding('class.tree-node-content-focused')
    get focusClass() {
        return this.node.isFocused
    }

    ngOnInit() {
    }

}
