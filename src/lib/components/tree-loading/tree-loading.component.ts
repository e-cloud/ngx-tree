import { ChangeDetectionStrategy, Component, HostBinding, Input, TemplateRef } from '@angular/core'
import { TreeNode } from '../../models'

@Component({
    selector: 'ngx-tree-loading',
    templateUrl: './tree-loading.component.html',
    styleUrls: ['./tree-loading.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeLoadingComponent {
    @Input() template: TemplateRef<any>
    @Input() node: TreeNode

    @HostBinding('class.tree-loading') className = true
}
