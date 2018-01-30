import { EventEmitter } from '@angular/core'
import { TreeEvent } from '../models'

export const TREE_EVENTS = {
    expand: 'expand',
    collapse: 'collapse',
    toggleExpander: 'toggleExpander',
    activate: 'activate',
    deactivate: 'deactivate',
    focus: 'focus',
    blur: 'blur',
    initialized: 'initialized',
    moveNode: 'moveNode',
    loadChildren: 'loadChildren',
    changeFilter: 'changeFilter',
    removeNode: 'removeNode',
    addNode: 'addNode',
}

/**
 * all events that the tree will trigger
 */
export interface EventsMap {
    expand: EventEmitter<TreeEvent>
    collapse: EventEmitter<TreeEvent>
    toggleExpander: EventEmitter<TreeEvent>
    /**
     * normally triggered by clicking or tabbing the enter key
     */
    activate: EventEmitter<TreeEvent>
    deactivate: EventEmitter<TreeEvent>
    /**
     * focus is different from activate, because focus can be changed by arrow keys of keyboard
     */
    focus: EventEmitter<TreeEvent>
    blur: EventEmitter<TreeEvent>
    initialized: EventEmitter<TreeEvent>
    moveNode: EventEmitter<TreeEvent>
    loadChildren: EventEmitter<TreeEvent>
    changeFilter: EventEmitter<TreeEvent>
    removeNode: EventEmitter<TreeEvent>
    addNode: EventEmitter<TreeEvent>
}
