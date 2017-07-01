import { AfterViewInit, Component, HostBinding, Input } from '@angular/core'
import { TreeNode } from '../../models/tree-node'

@Component({
    selector: 'ngx-tree-node-wrapper',
    templateUrl: './tree-node-wrapper.component.html',
    styleUrls: ['./tree-node-wrapper.component.scss'],
})
export class TreeNodeWrapperComponent implements AfterViewInit {
    @Input() node: TreeNode
    @Input() index: number
    @Input() templates: any

    @HostBinding('class.tree-node-wrapper') className = true

    constructor() {
    }

    @HostBinding('style.padding-left')
    get leftPadding() {
        return this.node.getNodePadding()
    }

    ngAfterViewInit() {
    }

}
