import { Component, Input, OnInit, TemplateRef } from '@angular/core'
import { TreeNode } from '../../models/tree-node'

@Component({
    selector: 'ngx-tree-loading',
    templateUrl: './tree-loading.component.html',
    styleUrls: ['./tree-loading.component.scss'],
})
export class TreeLoadingComponent implements OnInit {
    @Input() template: TemplateRef<any>
    @Input() node: TreeNode

    constructor() {
    }

    ngOnInit() {
    }

}
