import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core'
import { merge, Subscription } from 'rxjs'

import { TreeEvent, TreeNode, TreeUIOptions } from '../../models'

@Component({
    selector: 'ngx-tree-node-expander',
    templateUrl: './tree-node-expander.component.html',
    styleUrls: ['./tree-node-expander.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeNodeExpanderComponent implements OnInit, OnDestroy {
    @Input() options: TreeUIOptions
    @Input() node: TreeNode
    @Input() index: number
    @Input() template: TemplateRef<any>

    @HostBinding('class.tree-node-expander') className = true

    private structureChangeSub = Subscription.EMPTY

    constructor(private cdRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        if (this.node.treeModel) {
            this.structureChangeSub = merge<TreeEvent>(
                this.node.treeModel.events.addNode,
                this.node.treeModel.events.removeNode,
            )
                .subscribe((event: TreeEvent) => {
                    if (event.node && event.node.parent === this.node) {
                        this.cdRef.markForCheck()
                    }
                })
        }
    }

    ngOnDestroy() {
        this.structureChangeSub.unsubscribe()
    }
}
