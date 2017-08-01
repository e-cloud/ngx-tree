import { ChangeDetectionStrategy, Component, HostBinding, Input, TemplateRef } from '@angular/core'
import { TreeNode } from '../../models'

@Component({
    selector: 'ngx-tree-node-content',
    templateUrl: './tree-node-content.component.html',
    styleUrls: ['./tree-node-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeContentComponent {
    @Input() node: TreeNode
    @Input() index: number
    @Input() template: TemplateRef<any>
    @HostBinding('class.tree-node-content') className = true
}
