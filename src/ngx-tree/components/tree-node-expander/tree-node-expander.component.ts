import { Component, HostBinding, Input, TemplateRef } from '@angular/core'
import { TreeNode, TreeUIOptions } from '../../models'

@Component({
    selector: 'ngx-tree-node-expander',
    templateUrl: './tree-node-expander.component.html',
    styleUrls: ['./tree-node-expander.component.scss'],
})
export class TreeNodeExpanderComponent {
    @Input() options: TreeUIOptions
    @Input() node: TreeNode
    @Input() index: number
    @Input() template: TemplateRef<any>

    @HostBinding('class.tree-node-expander') className = true
}
