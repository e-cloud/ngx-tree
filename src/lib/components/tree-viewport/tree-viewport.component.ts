import {
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
} from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { TREE_EVENTS } from '../../constants/events'
import { TreeModel } from '../../models/tree-model'
import { TreeVirtualScroll } from '../../services/tree-virtual-scroll.service'

@Component({
    selector: 'ngx-tree-viewport',
    templateUrl: './tree-viewport.component.html',
    styleUrls: ['./tree-viewport.component.scss'],
    providers: [TreeVirtualScroll],
})
export class TreeViewportComponent implements OnChanges, AfterViewInit, OnDestroy {
    lastScrollTop = 0

    @Input() treeModel: TreeModel

    @HostBinding('class.tree-viewport') className = true

    private ticking = false
    private structureChangeSub: Subscription

    constructor(public virtualScroll: TreeVirtualScroll, private elementRef: ElementRef) {
    }

    @HostListener('scroll', ['$event'])
    onScroll(event) {
        if (this.virtualScroll.isDisabled()) {
            return
        }

        const currentScrollTop = this.elementRef.nativeElement.scrollTop
        if (Math.abs(currentScrollTop - this.lastScrollTop) < this.virtualScroll.averageNodeHeight) {
            return false
        }

        this.lastScrollTop = currentScrollTop

        if (!this.ticking) {
            window.requestAnimationFrame(() => {

                this.setViewport()
                this.ticking = false
            })
        }

        this.ticking = true

        event.preventDefault()
        event.stopPropagation()

        return false
    }

    ngOnChanges(changes) {
        if ('treeModel' in changes) {
            this.virtualScroll.setDisabled(!this.treeModel.options.useVirtualScroll)
            if (this.virtualScroll.isDisabled()) {
                return
            }
            this.initStructureSubscription()
            this.virtualScroll.reCalcPositions(this.treeModel)
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.virtualScroll.isDisabled()) {
                return
            }
            this.virtualScroll.reCalcPositions(this.treeModel)
            this.setViewport()
            this.treeModel.fireEvent({ eventName: TREE_EVENTS.initialized })
        })
    }

    ngOnDestroy() {
        if (this.structureChangeSub) {
            this.structureChangeSub.unsubscribe()
        }
    }

    initStructureSubscription() {
        this.ngOnDestroy()
        this.structureChangeSub = Observable.merge(
            this.treeModel.events.expand,
            this.treeModel.events.collapse,
            this.treeModel.events.loadChildren,
            this.treeModel.events.changeFilter,
            this.treeModel.events.addNode,
            this.treeModel.events.removeNode,
            )
            .subscribe(() => {
                this.virtualScroll.reCalcPositions(this.treeModel)
                this.setViewport()
            })
    }

    setViewport() {
        if (this.virtualScroll.isDisabled()) {
            return
        }

        this.virtualScroll.adjustViewport(
            this.elementRef.nativeElement.getBoundingClientRect(),
            this.lastScrollTop,
        )
    }
}
