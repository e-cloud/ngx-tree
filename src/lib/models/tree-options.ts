import defaults from 'lodash-es/defaults'
import defaultsDeep from 'lodash-es/defaultsDeep'
import { defaultActionMapping } from './actions'
import { TreeModel } from './tree-model'
import { TreeNode } from './tree-node'

export interface ActionHandler {
    (tree: TreeModel, node: TreeNode, $event: any, ...rest);
}

export interface ActionMapping {
    mouse?: {
        click?: ActionHandler,
        dblClick?: ActionHandler,
        contextMenu?: ActionHandler,
        expanderClick?: ActionHandler,
        dragStart?: ActionHandler,
        drag?: ActionHandler,
        dragEnd?: ActionHandler,
        dragOver?: ActionHandler,
        dragLeave?: ActionHandler,
        dragEnter?: ActionHandler,
        drop?: ActionHandler,
    };
    keys?: {
        [key: number]: ActionHandler
    };
}

export interface DropTarget {
    parent: TreeNode
    index: number
}

export type IAllowDropFn = (element: TreeNode, to: DropTarget, $event?: DragEvent) => boolean

export type IAllowDragFn = (node: TreeNode) => boolean

export const defaultUIOptions: TreeUIOptions = {
    allowDrag: false,
    allowDrop: false,
    levelPadding: 0,
    useVirtualScroll: false,
    nodeClass: () => '',
}

export const defaultDataOptions: TreeDataOptions = {
    childrenField: 'children',
    displayField: 'name',
    idField: 'id',
    isExpandedField: 'isExpanded',
    actionMapping: defaultActionMapping,
    getChildren: (node) => null,
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
    levelPadding?: number;
    /**
     * Boolean whether virtual scroll should be used.
     * Increases performance for large trees
     * Default is false
     */
    useVirtualScroll?: boolean;

    /**
     * Supply function for getting a custom class for the node component
     */
    nodeClass?(node: TreeNode): string;
}

export function createTreeUIOptions(rawOpts?: TreeUIOptions) {
    return defaults({}, rawOpts, defaultUIOptions)
}

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
    actionMapping?: any;

    /**
     * Supply function for getting fields asynchronously. Should return a Promise
     */
    getChildren?(node: TreeNode): Promise<any[]>;
}

export function createTreeDataOptions(rawOpts?: TreeDataOptions) {
    return defaultsDeep({}, rawOpts, defaultDataOptions)
}

// export const TREE_DATA_OPTIONS = new InjectionToken('TREE_DATA_OPTIONS')
