import defaults from 'lodash-es/defaults'
import defaultsDeep from 'lodash-es/defaultsDeep'
import isNumber from 'lodash-es/isNumber'
import { defaultActionMapping } from './actions'
import { DragAndDropEvent } from './events'
import { TreeModel } from './tree-model'
import { TreeNode } from './tree-node'

/**
 * common functions to handle tree actions
 */
export interface ActionHandler<T = any> {
    // tslint:disable-next-line:callable-types
    (tree: TreeModel, node: TreeNode, $event: T, ...args: any[]): void;
}

/**
 * a mapping model to link mouse events and keyboard events with actions
 */
export interface ActionMapping {
    mouse?: {
        click?: ActionHandler<MouseEvent>,
        dblClick?: ActionHandler<MouseEvent>,
        contextMenu?: ActionHandler<MouseEvent>,
        expanderClick?: ActionHandler<MouseEvent>,
        dragStart?: ActionHandler<DragAndDropEvent>,
        drag?: ActionHandler<DragAndDropEvent>,
        dragEnd?: ActionHandler<DragAndDropEvent>,
        dragOver?: ActionHandler<DragAndDropEvent>,
        dragLeave?: ActionHandler<DragAndDropEvent>,
        dragEnter?: ActionHandler<DragAndDropEvent>,
        drop?: ActionHandler<DragAndDropEvent>,
    };
    keys?: {
        [key: number]: ActionHandler<KeyboardEvent>
    };
}

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp]

export type AvailableMouseEvents = keyof Exclude<PropType<ActionMapping, 'mouse'>, undefined>

export interface DropTarget {
    parent: TreeNode
    index: number
}

export type IAllowDropFn = (element: TreeNode, to: DropTarget, $event?: DragEvent) => boolean

export type IAllowDragFn = (node: TreeNode) => boolean

export type ILevelPaddingFn = (node: TreeNode) => string

export const defaultUIOptions: TreeUIOptions = {
    allowDrag: false,
    allowDrop: false,
    levelPadding: () => '0px',
    useVirtualScroll: false,
    nodeClass: () => '',
}

export const defaultDataOptions: TreeDataOptions = {
    childrenField: 'children',
    displayField: 'name',
    idField: 'id',
    isExpandedField: 'isExpanded',
    actionMapping: defaultActionMapping,
    getChildren: (node: TreeNode) => Promise.resolve([]),
}

export interface TreeUIOptions {
    /**
     * Specify if dragging tree nodes is allowed.
     * This could be a boolean, or a function that receives a TreeNode and returns a boolean
     *
     * **Default value: false**
     *
     * Example:
     * ```
     * options = {
     *   allowDrag: true
     * }
     * ```
     */
    allowDrag?: boolean | IAllowDragFn;
    /**
     * Specify whether dropping inside the tree is allowed. Optional types:
     *  - boolean
     *  - (element:any, to:{parent:ITreeNode, index:number}):boolean
     * A function that receives the dragged element, and the drop location (parent node and index inside the parent),
     * and returns true or false.
     *
     * **Default Value: true**
     *
     * example:
     * ```
     * options = {
     *  allowDrop: (element, {parent, index}) => parent.isLeaf
     * }
     * ```
     */
    allowDrop?: boolean | IAllowDropFn;
    /**
     * Specify padding per node instead of children padding (to allow full row select for example)
     */
    levelPadding?: ILevelPaddingFn;
    /**
     * Boolean whether virtual scroll should be used.
     * Increases performance for large trees
     * Default is false
     */
    useVirtualScroll?: boolean;
    /**
     * the item height in tree the virtual scrolling algorithm will refer to, not determinate
     * if user provide a proper value, it would boost the initial rendering time for tree with big dataset initially
     */
    referenceItemHeight?: number;

    /**
     * Supply function for getting a custom class for the node component
     */
    nodeClass?(node: TreeNode): string;
}

export interface RawTreeUIOptions {
    allowDrag?: boolean | IAllowDragFn;
    allowDrop?: boolean | IAllowDropFn;
    levelPadding?: number | ILevelPaddingFn;
    useVirtualScroll?: boolean;
    referenceItemHeight?: number;

    nodeClass?(node: TreeNode): string;
}

/**
 * create tree options about UI with defaults
 * @param rawOpts
 */
export function createTreeUIOptions(rawOpts: RawTreeUIOptions = {}): TreeUIOptions {
    const levelPaddingOpt = rawOpts.levelPadding
    if (isNumber(levelPaddingOpt)) {
        rawOpts.levelPadding = function (node: TreeNode) {
            return (levelPaddingOpt + levelPaddingOpt * (node.level - 1)) + 'px'
        }
    }

    return defaults({}, rawOpts, defaultUIOptions)
}

export type CustomFieldPrefix = 'id' | 'children' | 'display' | 'isExpanded'
export type CustomFieldNames = 'idField' | 'childrenField' | 'displayField' | 'isExpandedField'

export interface TreeDataOptions {
    /**
     * Override children field. Default: 'children'
     */
    childrenField?: string;
    /**
     * Override display field. Default: 'name'
     */
    displayField?: string;
    /**
     * Override id field. Default: 'id'
     */
    idField?: string;
    /**
     * Override isExpanded field. Default: 'isExpanded'
     */
    isExpandedField?: string;
    /**
     * Change the default mouse and key actions on the tree
     */
    actionMapping?: ActionMapping;

    /**
     * Supply function for getting fields asynchronously. Should return a Promise
     */
    getChildren?(node: TreeNode): Promise<any[]>;
}

/**
 * create tree options about data with defaults
 * @param rawOpts
 */
export function createTreeDataOptions(rawOpts: TreeDataOptions = {}): TreeDataOptions {
    return defaultsDeep({}, rawOpts, defaultDataOptions)
}

// export const TREE_DATA_OPTIONS = new InjectionToken('TREE_DATA_OPTIONS')
