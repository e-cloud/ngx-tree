import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
} from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { TREE_EVENTS } from '../../constants/events'
import { TreeModel } from '../../models/tree-model'
import { TreeVirtualScroll } from '../../services/tree-virtual-scroll.service'

@Component({
    moduleId: module.id,
    selector: 'ngx-tree-viewport',
    templateUrl: './tree-viewport.component.html',
    styleUrls: ['./tree-viewport.component.scss'],
    providers: [TreeVirtualScroll],
})
export class TreeViewportComponent implements AfterViewInit, OnDestroy, OnChanges, AfterViewChecked {
    @Input() treeModel: TreeModel

    @HostBinding('class.tree-viewport') className = true

    lastScrollTop = 0
    ticking = false
    structSub: Subscription

    constructor(private virtualScroll: TreeVirtualScroll, private elementRef: ElementRef) {
    }

    ngOnChanges(changes) {
        if ('treeModel' in changes) {
            this.initStructureSubscription()
            this.virtualScroll.reCalcPositions(this.treeModel)
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.virtualScroll.reCalcPositions(this.treeModel)
            this.setViewport()
            this.treeModel.fireEvent({ eventName: TREE_EVENTS.initialized })
        })
    }

    ngAfterViewChecked() {
        if (this.virtualScroll.needFixScroll) {
            // console.log('before', this.lastScrollTop, 'current', this.elementRef.nativeElement.scrollTop)

            // this.elementRef.nativeElement.scrollTop = this.lastScrollTop
            this.virtualScroll.needFixScroll = false
        }

        // console.log('Checked', this.lastScrollTop, 'current', this.elementRef.nativeElement.scrollTop)
    }

    ngOnDestroy() {
        if (this.structSub) {
            this.structSub.unsubscribe()
        }
    }

    initStructureSubscription() {
        this.ngOnDestroy()
        this.structSub = Observable.merge(
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

    @HostListener('scroll', ['$event'])
    onScroll() {
        const currentScrollTop = this.elementRef.nativeElement.scrollTop
        if (Math.abs(currentScrollTop - this.lastScrollTop) < this.virtualScroll.averageNodeHeight) {
            return
        }
        this.lastScrollTop = currentScrollTop
        if (!this.ticking) {
            window.requestAnimationFrame(() => {

                this.setViewport()
                this.ticking = false
            })
        }
        this.ticking = true
    }

    setViewport() {
        this.virtualScroll.adjustViewport(this.elementRef.nativeElement.getBoundingClientRect(), this.lastScrollTop)
    }
}
