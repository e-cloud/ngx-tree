import { Directive, ElementRef, HostListener, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core'
import { TreeNode } from '../models'
import { TreeDraggingTargetService } from '../services/tree-dragging-target.service'

const DRAGGING_TARGET_CLASS = 'ngx-tree-dragging-target'

@Directive({
    selector: '[ngxTreeDrag]',
})
export class TreeDragDirective implements OnChanges {
    @Input('ngxTreeDrag') draggingTarget: TreeNode
    @Input() treeDragEnabled: boolean

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private treeDraggingTargetService: TreeDraggingTargetService,
    ) {
    }

    @HostListener('dragstart', ['$event'])
    onDragStart(ev: DragEvent) {
        // setting the data is required by firefox
        ev.dataTransfer!.setData('text', this.draggingTarget.id)
        ev.dataTransfer!.dropEffect = 'move'
        this.renderer.addClass(this.el.nativeElement, DRAGGING_TARGET_CLASS)

        this.treeDraggingTargetService.set(this.draggingTarget)
        if (this.draggingTarget.mouseAction) {
            this.draggingTarget.mouseAction('dragStart', ev)
        }
    }

    /*@HostListener('drag', ['$event'])
    onDrag(ev) {
        if (this.draggingTarget.mouseAction) {
            this.draggingTarget.mouseAction('drag', ev)
        }

        console.log('drag')
    }*/

    @HostListener('dragend', ['$event'])
    onDragEnd(event: DragEvent) {
        if (this.draggingTarget.mouseAction) {
            this.draggingTarget.mouseAction('dragEnd', event)
        }

        this.renderer.removeClass(this.el.nativeElement, DRAGGING_TARGET_CLASS)

        this.treeDraggingTargetService.set(null)
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('treeDragEnabled' in changes) {
            this.renderer.setAttribute(this.el.nativeElement, 'draggable', this.treeDragEnabled ? 'true' : 'false')
        }
    }
}
