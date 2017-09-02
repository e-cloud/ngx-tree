import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, } from '@angular/core'
import isFunction from 'lodash-es/isFunction'
import { TreeNode, TreeUIOptions } from '../../models'
import { TreeVirtualScroll } from '../../services/tree-virtual-scroll.service'

@Component({
    selector: 'ngx-tree-node-wrapper',
    templateUrl: './tree-node-wrapper.component.html',
    styleUrls: ['./tree-node-wrapper.component.scss'],
})
export class TreeNodeWrapperComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() node: TreeNode
    @Input() options: TreeUIOptions
    @Input() index: number
    @Input() templates: any

    @HostBinding('class.tree-node-wrapper') className = true

    constructor(private virtualScroll: TreeVirtualScroll, private elementRef: ElementRef) {
    }

    ngOnInit() {
        this.node.elementRef = this.elementRef
    }

    ngOnDestroy() {
        this.node.elementRef = null
    }

    ngAfterViewInit() {
        if (!this.virtualScroll.isDisabled()) {
            this.virtualScroll.reportNodeHeight(this.elementRef.nativeElement.getBoundingClientRect().height)
        }
    }

    allowDrag(node: TreeNode) {
        return isFunction(this.options.allowDrag) ? this.options.allowDrag(node) : this.options.allowDrag
    }

    allowDrop(node: TreeNode, $event?: DragEvent) {
        return isFunction(this.options.allowDrop)
            ? this.options.allowDrop(node, { parent: this.node, index: node.index }, $event)
            : this.options.allowDrop
    }
}
