import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core'
import { TREE_EVENTS } from '../../constants/events'
import { TreeVirtualScroll } from '../../services/tree-virtual-scroll.service'

@Component({
    selector: 'ngx-tree-viewport',
    templateUrl: './tree-viewport.component.html',
    styleUrls: ['./tree-viewport.component.scss'],
})
export class TreeViewportComponent implements AfterViewInit, OnInit, OnDestroy {

    constructor(
        private elementRef: ElementRef,
        public virtualScroll: TreeVirtualScroll,
    ) {
    }

    ngOnInit() {
        this.virtualScroll.init()
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.setViewport()
            this.virtualScroll.fireEvent({ eventName: TREE_EVENTS.initialized })
        })
    }

    ngOnDestroy() {
        this.virtualScroll.clear()
    }

    @HostListener('scroll', ['$event'])
    onScroll(e) {
        this._onWheel(e)
    }

    getTotalHeight() {
        return this.virtualScroll.isEnabled() && this.virtualScroll.totalHeight + 'px' || 'auto'
    }

    _onWheel(e) {
        this.setViewport()
    }

    setViewport() {
        this.virtualScroll.setViewport(this.elementRef.nativeElement)
    }
}
