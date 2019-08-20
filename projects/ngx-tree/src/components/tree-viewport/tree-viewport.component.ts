import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Renderer2,
    SimpleChanges,
} from '@angular/core'
import { merge, Subscription } from 'rxjs'
import { TREE_EVENTS } from '../../constants/events'
import { ScrollIntoViewTarget, TreeModel } from '../../models'
import { TreeVirtualScroll } from '../../services/tree-virtual-scroll.service'

const DISABLE_ON_SCROLL_CLASS = 'disable-events-on-scroll'

@Component({
    selector: 'ngx-tree-viewport',
    templateUrl: './tree-viewport.component.html',
    styleUrls: ['./tree-viewport.component.scss'],
    providers: [TreeVirtualScroll],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeViewportComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    lastScrollTop = 0
    isScrolling = false

    @Input() enable: boolean
    @Input() referenceItemHeight = 0

    @Input() treeModel: TreeModel

    @HostBinding('class.tree-viewport') className = true

    private ticking = false
    private scrollIntoViewTicking = false
    private lastScrollIntoViewTarget: ScrollIntoViewTarget
    private structureChangeSub = Subscription.EMPTY
    private scrollIntoViewSub = Subscription.EMPTY
    private scrollTimer: number | null

    constructor(public virtualScroll: TreeVirtualScroll, private elementRef: ElementRef, private renderer: Renderer2) {
    }

    @HostListener('scroll', ['$event'])
    onScroll(event: MouseEvent) {
        this.disableEventsWhenScrolling()
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
            this.ticking = true
        }

        event.preventDefault()
        event.stopPropagation()

        return false
    }

    ngOnInit() {
        this.scrollIntoViewSub = this.treeModel.scrollIntoView$.subscribe((target: ScrollIntoViewTarget) => {
            if (target.node.elementRef) {
                this.scrollIntoViewAndTick(target, () => {
                    const lastTarget = this.lastScrollIntoViewTarget
                    if (lastTarget.node.elementRef!.nativeElement.scrollIntoViewIfNeeded) {
                        lastTarget.node.elementRef!.nativeElement.scrollIntoViewIfNeeded(lastTarget.scrollToMiddle)
                    } else {
                        lastTarget.node.elementRef!.nativeElement.scrollIntoView({
                            behavior: 'auto',
                            block: 'end',
                        })
                    }
                })
            }
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('treeModel' in changes) {
            this.virtualScroll.setDisabled(!this.enable)
            if (this.virtualScroll.isDisabled()) {
                if (!changes.treeModel.isFirstChange()) {
                    this.treeModel.fireEvent({ eventName: TREE_EVENTS.initialized })
                }

                return
            }

            this.initEventSubscription()
            if (this.referenceItemHeight) {
                this.virtualScroll.averageNodeHeight = this.referenceItemHeight
            }
            this.virtualScroll.reCalcPositions(this.treeModel)

            if (!changes.treeModel.isFirstChange()) {
                // use setTimeout to avoid do calculation on old data,
                // let the new data render first round
                setTimeout(() => {
                    this.setViewport()
                    this.treeModel.fireEvent({ eventName: TREE_EVENTS.initialized })
                })
            } else if (this.referenceItemHeight) {
                // boot up the rendering performance at first change
                this.setViewport()
            }
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.virtualScroll.isDisabled()) {
                this.treeModel.fireEvent({ eventName: TREE_EVENTS.initialized })

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
        if (this.scrollIntoViewSub) {
            this.scrollIntoViewSub.unsubscribe()
        }
    }

    scrollIntoViewAndTick(target: ScrollIntoViewTarget, scrollCallback: Function) {
        this.lastScrollIntoViewTarget = target
        if (!this.scrollIntoViewTicking) {
            window.requestAnimationFrame(() => {
                scrollCallback()
                this.scrollIntoViewTicking = false
            })
            this.scrollIntoViewTicking = true
        }
    }

    initEventSubscription() {
        this.ngOnDestroy()
        this.scrollIntoViewSub = this.treeModel.scrollIntoView$.subscribe((target: ScrollIntoViewTarget) => {
            this.scrollIntoViewAndTick(target, () => {
                const lastTarget = this.lastScrollIntoViewTarget
                const targetOffset = this.virtualScroll.scrollIntoView(lastTarget.node, lastTarget.force, lastTarget.scrollToMiddle)

                if (targetOffset) {
                    this.elementRef.nativeElement.scrollTop = targetOffset
                }
            })
        })

        this.structureChangeSub = merge(
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

    private disableEventsWhenScrolling() {
        if (this.scrollTimer) {
            clearTimeout(this.scrollTimer)
        } else {
            this.isScrolling = true
            this.renderer.addClass(this.elementRef.nativeElement, DISABLE_ON_SCROLL_CLASS)
        }

        this.scrollTimer = <any>setTimeout(() => {
            this.isScrolling = false
            this.renderer.removeClass(this.elementRef.nativeElement, DISABLE_ON_SCROLL_CLASS)

            this.scrollTimer = null
        }, 120)
    }
}
