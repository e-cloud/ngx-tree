import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject'
import { TreeNode } from '../models/tree-node'

@Injectable()
export class TreeDraggingTarget extends Subject<TreeNode> {
    _draggedElement: any = null

    set(draggedElement: any) {
        this._draggedElement = draggedElement
    }

    get(): any {
        return this._draggedElement
    }

    isDragging() {
        return !!this.get()
    }
}
