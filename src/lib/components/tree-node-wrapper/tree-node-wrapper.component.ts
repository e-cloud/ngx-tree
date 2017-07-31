import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input } from '@angular/core'
import { TreeNode } from '../../models/tree-node'
import { TreeVirtualScroll } from '../../services/tree-virtual-scroll.service'

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

    constructor(private virtualScroll: TreeVirtualScroll, private elementRef: ElementRef) {
    }

    @HostBinding('style.padding-left')
    get leftPadding() {
        return this.node.getNodePadding()
    }

    ngAfterViewInit() {
        if (!this.virtualScroll.isDisabled()) {
            this.virtualScroll.reportNodeHeight(this.elementRef.nativeElement.getBoundingClientRect().height)
        }
    }
}
