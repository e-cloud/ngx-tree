import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core'

@Component({
    selector: 'ngx-tree-viewport',
    templateUrl: './tree-viewport.component.html',
    styleUrls: ['./tree-viewport.component.scss'],
})
export class TreeViewportComponent implements AfterViewInit, OnInit, OnDestroy {

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.setViewport()
        })
    }

    ngOnDestroy() {
    }

    @HostListener('scroll', ['$event'])
    onScroll(e) {
        this._onWheel(e)
    }

    getTotalHeight() {
        return 'auto'
    }

    _onWheel(e) {
        this.setViewport()
    }

    setViewport() {
    }
}
