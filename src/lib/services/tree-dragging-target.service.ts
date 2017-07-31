import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject'
import { TreeNode } from '../models'

@Injectable()
export class TreeDraggingTargetService extends Subject<TreeNode> {
    _draggedElement: TreeNode = null

    set(draggedElement: TreeNode) {
        this._draggedElement = draggedElement
    }

    get() {
        return this._draggedElement
    }

    isDragging() {
        return !!this.get()
    }
}
