import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core'
import isFunction from 'lodash-es/isFunction'
import { merge, Subscription } from 'rxjs'

import { TreeEvent, TreeNode, TreeTemplateMapping, TreeUIOptions } from '../../models'

@Component({
    selector: 'ngx-tree-node',
    templateUrl: './tree-node.component.html',
    styleUrls: ['./tree-node.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeComponent implements OnInit, OnDestroy {
    @Input() node: TreeNode
    @Input() options: TreeUIOptions
    @Input() index: number
    @Input() templates: TreeTemplateMapping

    @HostBinding('class.tree-node') className = true
    private operationSub = Subscription.EMPTY

    constructor(private cdRef: ChangeDetectorRef) {
    }

    get allowDrop() {
        return (node: TreeNode, $event?: DragEvent) => {
            return isFunction(this.options.allowDrop)
                ? this.options.allowDrop(node, { parent: this.node, index: node.index }, $event)
                : this.options.allowDrop
        }
    }

    ngOnInit() {
        if (this.node.treeModel) {
            this.operationSub = merge<TreeEvent>(
                this.node.treeModel.events.expand,
                this.node.treeModel.events.collapse,
                this.node.treeModel.events.activate,
                this.node.treeModel.events.deactivate,
                this.node.treeModel.events.focus,
                this.node.treeModel.events.blur
            ).subscribe((evt: TreeEvent) => {
                if (evt.node && evt.node === this.node) {
                    this.cdRef.markForCheck()
                }
            })
        }
    }

    ngOnDestroy() {
        this.operationSub.unsubscribe()
    }

    allowDrag(node: TreeNode) {
        return isFunction(this.options.allowDrag) ? this.options.allowDrag(node) : this.options.allowDrag
    }
}
