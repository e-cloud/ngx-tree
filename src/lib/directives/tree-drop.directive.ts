import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core'
import { TreeNode } from 'ngx-tree/models/tree-node'
import { TreeDraggingTargetService } from 'ngx-tree/services/tree-dragging-target.service'

const DRAG_OVER_CLASS = 'is-dragging-over'
const DRAG_DISABLED_CLASS = 'is-dragging-over-disabled'

export type AllowDropPredicate = (element: TreeNode, $event: MouseEvent) => boolean

@Directive({
    selector: '[ngxTreeDrop]',
})
export class TreeDropDirective {
    @Output('ngxTreeDrop') onDrop$ = new EventEmitter()
    @Output('treeDropDragOver') onDragOver$ = new EventEmitter()
    @Output('treeDropDragLeave') onDragLeave$ = new EventEmitter()
    @Output('treeDropDragEnter') onDragEnter$ = new EventEmitter()

    @Input()
    set treeAllowDrop(allowDrop: boolean | AllowDropPredicate) {
        if (allowDrop instanceof Function) {
            this._allowDrop = allowDrop
        } else {
            this._allowDrop = (element, $event) => allowDrop
        }
    }

    private dragOverClassAdded: boolean
    private disabledClassAdded: boolean

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private treeDraggedElement: TreeDraggingTargetService,
    ) {
    }

    @HostListener('dragover', ['$event'])
    onDragOver($event) {
        if (!this.allowDrop($event)) {
            return
        }


        this.onDragOver$.emit({ event: $event, element: this.treeDraggedElement.get() })

        if (!this.dragOverClassAdded) {
            this.addClass()
        }

        this._stopEvent(event)
    }

    @HostListener('dragenter', ['$event'])
    onDragEnter($event) {
        if (!this.allowDrop($event)) {
            this.addDisabledClass()

            return
        }

        this.onDragEnter$.emit({ event: $event, element: this.treeDraggedElement.get() })

        this.addClass()
        this._stopEvent(event)
    }

    @HostListener('dragleave', ['$event'])
    onDragLeave($event) {
        if (!this.allowDrop($event)) {
            this.removeDisabledClass()

            return
        }

        this.onDragLeave$.emit({ event: $event, element: this.treeDraggedElement.get() })

        this.removeClass()

        this._stopEvent(event)
    }

    @HostListener('drop', ['$event'])
    onDrop($event) {
        if (!this.allowDrop($event)) {
            return
        }

        $event.preventDefault()
        this.onDrop$.emit({ event: $event, element: this.treeDraggedElement.get() })
        this.removeClass()
        this.treeDraggedElement.set(null)
    }

    allowDrop($event) {
        return this._allowDrop(this.treeDraggedElement.get(), $event)
    }

    private _stopEvent(event: Event): void {
        event.preventDefault()
        event.stopPropagation()
    }

    private _allowDrop: AllowDropPredicate = (element, $event) => true

    private addClass() {
        this.dragOverClassAdded = true
        this.renderer.addClass(this.el.nativeElement, DRAG_OVER_CLASS)
    }

    private removeClass() {
        this.dragOverClassAdded = false
        this.renderer.removeClass(this.el.nativeElement, DRAG_OVER_CLASS)
    }

    private addDisabledClass() {
        this.disabledClassAdded = true
        this.renderer.addClass(this.el.nativeElement, DRAG_DISABLED_CLASS)
    }

    private removeDisabledClass() {
        this.disabledClassAdded = false
        this.renderer.removeClass(this.el.nativeElement, DRAG_DISABLED_CLASS)
    }
}
