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

export interface EventsMap {
    expand: EventEmitter<TreeEvent>
    collapse: EventEmitter<TreeEvent>
    toggleExpander: EventEmitter<TreeEvent>
    activate: EventEmitter<TreeEvent>
    deactivate: EventEmitter<TreeEvent>
    focus: EventEmitter<TreeEvent>
    blur: EventEmitter<TreeEvent>
    initialized: EventEmitter<TreeEvent>
    moveNode: EventEmitter<TreeEvent>
    loadChildren: EventEmitter<TreeEvent>
    changeFilter: EventEmitter<TreeEvent>
    removeNode: EventEmitter<TreeEvent>
    addNode: EventEmitter<TreeEvent>
}
