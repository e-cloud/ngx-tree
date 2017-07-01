import { AfterViewInit, Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core'

@Component({
    selector: 'ngx-tree-viewport',
    templateUrl: './tree-viewport.component.html',
    styleUrls: ['./tree-viewport.component.scss'],
})
export class TreeViewportComponent implements AfterViewInit, OnInit, OnDestroy {
    @HostBinding('class.tree-viewport') className = true

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
    onScroll() {
        this.setViewport()
    }

    setViewport() {
    }
}
