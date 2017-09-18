import compact from 'lodash-es/compact'
import find from 'lodash-es/find'
import first from 'lodash-es/first'
import isFunction from 'lodash-es/isFunction'
import isString from 'lodash-es/isString'
import last from 'lodash-es/last'
import { Observer } from 'rxjs/Observer'
import { Subject } from 'rxjs/Subject'
import { EventsMap, TREE_EVENTS } from '../constants/events'
import { TreeEvent } from './events'
import { TreeNode } from './tree-node'
import { createTreeDataOptions, TreeDataOptions } from './tree-options'

export interface ScrollIntoViewTarget {
    node: TreeNode
    force: boolean
    scrollToMiddle: boolean
}

export class TreeModel {
    static focusedTree: TreeModel = null

    /**
     * All root nodes
     */
    roots: TreeNode[]
    virtualRoot: TreeNode
    scrollIntoView$: Subject<ScrollIntoViewTarget> = new Subject()

    /**
     * Is the tree currently focused
     */
    get isFocused() {
        return TreeModel.focusedTree === this
    }

    /**
     * @returns      true if the tree is empty
     */
    get isEmptyTree() {
        return this.roots && this.roots.length === 0
    }

    /**
     * Current focused node
     */
    get focusedNode() {
        return this.focusedNodeId ? this.getNodeById(this.focusedNodeId) : null
    }

    /**
     * @returns Current expanded nodes
     */
    get expandedNodes() {
        const nodes = Array.from(this.expandedNodeIds.keys())
            .filter((id) => this.expandedNodeIds.get(id))
            .map((id) => this.getNodeById(id))

        return compact(nodes)
    }

    /**
     * @returns Current active (selected) nodes
     */
    get activeNodes() {
        const nodes = Array.from(this.activeNodeIds.keys())
            .filter((id) => this.activeNodeIds.get(id))
            .map((id) => this.nodeCache.get(id))

        return compact(nodes)
    }

    private focusedNodeId: string = null
    private expandedNodeIds: Map<string, boolean> = new Map()
    private activeNodeIds: Map<string, boolean> = new Map()
    private hiddenNodeIds: Map<string, boolean> = new Map()
    private nodeCache: Map<string, TreeNode> = new Map()

    constructor(
        private nodes: any[],
        public events: EventsMap,
        /**
         * Options that are passed to the tree component
         */
        public options: TreeDataOptions,
    ) {
        this.options = createTreeDataOptions(options)
        const virtualRootConfig = {
            virtual: true,
            // todo: determine to use fixed children field later
            [this.options.childrenField]: this.nodes,
        }

        this.virtualRoot = new TreeNode(virtualRootConfig, null, this, 0)
        this.setExpandedNodeInPlace(this.virtualRoot)

        this.roots = this.virtualRoot.children
    }

    addCache(node: TreeNode) {
        this.nodeCache.set(node.id, node)
    }

    updateOptions(options: TreeDataOptions) {
        this.options = options
    }

    // events
    fireEvent(event: TreeEvent) {
        // event.treeModel = this

        this.events[event.eventName].emit(event)
    }

    subscribe(eventName: string, fn: Observer<TreeEvent>) {
        return this.events[eventName].subscribe(fn)
    }

    // getters
    /**
     * @returns Current active (selected) node. If multiple nodes are active - returns the first one.
     */
    getActiveNode(): TreeNode {
        return this.activeNodes[0]
    }

    /**
     * @returns All root nodes that pass the current filter
     */
    getVisibleRoots() {
        return this.virtualRoot.visibleChildren
    }

    /**
     * @param skipHidden  true or false - whether to skip hidden nodes
     * @returns      first root of the tree
     */
    getFirstRoot(skipHidden = false) {
        return first(skipHidden ? this.getVisibleRoots() : this.roots)
    }

    /**
     * @param skipHidden  true or false - whether to skip hidden nodes
     * @returns      last root of the tree
     */
    getLastRoot(skipHidden = false) {
        return last(skipHidden ? this.getVisibleRoots() : this.roots)
    }

    // locating nodes
    /**
     * @param     path  array of node IDs to be traversed respectively
     * @param     startNode  optional. Which node to start traversing from
     * @returns   The node, if found - null otherwise
     */
    getNodeByPath(path: (string | number)[], startNode: TreeNode = null): TreeNode {
        if (!path) {
            return null
        }

        startNode = startNode || this.virtualRoot

        if (path.length === 0) {
            return startNode
        }

        if (!startNode.children) {
            return null
        }

        const childId = path.shift()
        const childNode = find(startNode.children, { id: childId })

        if (!childNode) {
            return null
        }

        return this.getNodeByPath(path, childNode)
    }

    /**
     * @param     id  node ID to find
     * @returns   The node, if found - null otherwise
     */
    getNodeById(id: string) {
        return this.nodeCache.get(id)
    }

    /**
     * @param     predicate - either an object or a function, used as a test condition on all nodes.
     *            Could be every predicate that's supported by lodash's `find` method
     * @param     startNode  optional. Which node to start traversing from
     * @returns   First node that matches the predicate, if found - null otherwise
     */
    getNodeBy(predicate: (node: TreeNode) => boolean, startNode: TreeNode = null) {
        // todo: refactor to a loop
        startNode = startNode || this.virtualRoot

        if (!startNode.children) {
            return null
        }

        const found = find(startNode.children, predicate)

        if (found) { // found in children
            return found
        } else { // look in children's children
            for (const child of startNode.children) {
                const foundInChildren = this.getNodeBy(predicate, child)
                if (foundInChildren) {
                    return foundInChildren
                }
            }
        }
    }

    isNodeExpanded(node: TreeNode) {
        return this.expandedNodeIds.get(node.id)
    }

    isNodeHidden(node: TreeNode) {
        return this.hiddenNodeIds.get(node.id)
    }

    isNodeActive(node: TreeNode) {
        return this.activeNodeIds.get(node.id)
    }

    isNodeFocused(node: TreeNode) {
        return this.focusedNode === node
    }

    setActiveNode(node: TreeNode, isActive: boolean, isMulti = false) {
        if (isMulti) {
            this.setMultiActiveNodes(node, isActive)
        } else {
            this.setSingleActiveNode(node, isActive)
        }

        if (isActive) {
            node.focus()
            this.fireEvent({ eventName: TREE_EVENTS.activate, node })
        } else {
            this.fireEvent({ eventName: TREE_EVENTS.deactivate, node })
        }
    }

    setExpandedNodeInPlace(node: TreeNode, isExpanded = true) {
        this.expandedNodeIds.set(node.id, isExpanded)
    }

    setExpandedNode(node: TreeNode, isExpanded = true) {
        this.expandedNodeIds.set(node.id, isExpanded)
        if (isExpanded) {
            this.fireEvent({ eventName: TREE_EVENTS.expand, node })
        } else {
            this.fireEvent({ eventName: TREE_EVENTS.collapse, node })
        }
        this.fireEvent({ eventName: TREE_EVENTS.toggleExpander, node, isExpanded })
    }

    setHiddenNode(node: TreeNode, isHidden = true) {
        this.hiddenNodeIds.set(node.id, isHidden)
    }

    /**
     * Set focus on a node
     * @param node
     */
    setFocusedNode(node: TreeNode) {
        this.focusedNodeId = node ? node.id : null
    }

    /**
     * Focuses or blurs the tree
     * @param value  true or false - whether to set focus or blur.
     */
    setFocus(value: boolean) {
        TreeModel.focusedTree = value ? this : null
    }

    traverse(fn: (node: TreeNode) => any) {
        this.roots.forEach((root) => root.traverse(fn))
    }

    activateNode(id) {
        const target = this.getNodeById(id)
        if (target) {
            target.setActiveAndVisible()

            return true
        }

        return false
    }

    focusNode(id: string) {
        const target = this.getNodeById(id)
        if (target) {
            target.focus()

            return true
        }

        return false
    }

    /**
     * Focuses on the next node in the tree (same as down arrow)
     */
    focusNextNode() {
        const previousNode = this.focusedNode
        const nextNode = previousNode ? previousNode.findNextNode(true, true) : this.getFirstRoot(true)
        if (nextNode) {
            nextNode.focus()
        }
    }

    /**
     * Focuses on the previous node in the tree (same as up arrow)
     */
    focusPreviousNode() {
        const previousNode = this.focusedNode
        const nextNode = previousNode ? previousNode.findPreviousNode(true) : this.getLastRoot(true)
        if (nextNode) {
            nextNode.focus()
        }
    }

    /**
     * Focuses on the inner child of the current focused node (same as right arrow on an expanded node)
     */
    focusDrillDown() {
        const previousNode = this.focusedNode
        if (previousNode && previousNode.isCollapsed && previousNode.hasChildren) {
            previousNode.toggleExpanded()
        } else {
            const nextNode = previousNode ? previousNode.getFirstChild(true) : this.getFirstRoot(true)
            if (nextNode) {
                nextNode.focus()
            }
        }
    }

    /**
     * Focuses on the parent of the current focused node (same as left arrow on a collapsed node)
     */
    focusDrillUp() {
        const previousNode = this.focusedNode
        if (!previousNode) {
            return
        }

        if (previousNode.isExpanded) {
            previousNode.toggleExpanded()
        } else {
            const nextNode = previousNode.parent
            if (nextNode) {
                nextNode.focus()
            }
        }
    }

    /**
     * expand all nodes
     */
    expandAll() {
        this.roots.forEach((root) => root.expandAll())
    }

    /**
     * collapse all nodes
     */
    collapseAll() {
        this.roots.forEach((root) => root.collapseAll())
    }

    performKeyAction(node: TreeNode, $event: KeyboardEvent) {
        // todo: the keyCode is deprecated on MDN, replace it some day
        const action = this.options.actionMapping.keys[$event.keyCode]
        if (action) {
            $event.preventDefault()
            action(this, node, $event)

            return true
        } else {
            return false
        }
    }

    /**
     * Marks isHidden field in all nodes recursively according to the filter param.
     * If a node is marked visible, all of its ancestors will be marked visible as well.
     * @param filter  either a string or a function.
     *   In case it's a string, it will be searched case insensitively in the node's display attribute
     *   In case it's a function, it will be passed the node, and should return true if the node should be visible,
     *     false otherwise
     * @param autoShow  if true, make sure all nodes that passed the filter are visible
     */
    filterNodes(filter: string | ((node: TreeNode) => boolean), autoShow = true) {
        let filterFn

        if (!filter) {
            return this.clearFilter()
        }

        // support function and string filter
        if (isString(filter)) {
            filterFn = (node) => node.displayField.toLowerCase().includes(filter.toLowerCase())
        } else if (isFunction(filter)) {
            filterFn = filter
        } else {
            throw new TypeError(`Don't know what to do with filter: ${filter}. It should be either a string or function`)
        }

        const ids = new Map()
        this.roots.forEach((node) => this.filterNode(ids, node, filterFn, autoShow))
        this.hiddenNodeIds = ids
        this.fireEvent({ eventName: TREE_EVENTS.changeFilter })
    }

    /**
     * Marks all nodes isHidden = false
     */
    clearFilter() {
        this.hiddenNodeIds = new Map()
        this.fireEvent({ eventName: TREE_EVENTS.changeFilter })
    }

    /**
     * moves a node from one location in the tree to another
     * @param node location has a from and a to attributes, each has a node and index attributes.
     * The combination of node + index tells which node needs to be moved, and to where
     * @param to
     */
    moveNode(node: TreeNode, to: { parent: TreeNode, index: number, dropOnNode: boolean }) {
        const fromIndex = node.index
        const fromParent = node.parent

        if (!canMoveNode(node, fromIndex, to)) {
            return
        }

        node.remove()

        // Compensate for index if already removed from parent:
        const toIndex = (fromParent === to.parent && to.index > fromIndex) ? to.index - 1 : to.index

        if (to.dropOnNode) {
            to.parent.appendChild(node.data)
        } else {
            to.parent.addChild(node.data, toIndex)
        }

        this.fireEvent({
            eventName: TREE_EVENTS.moveNode,
            node,
            to: { parent: to.parent.data, index: toIndex },
        })
    }

    scrollIntoView(node: TreeNode, force: boolean, scrollToMiddle: boolean) {
        this.scrollIntoView$.next({
            node, force, scrollToMiddle,
        })
    }

    private filterNode(
        ids: Map<string, boolean>,
        node: TreeNode,
        filterFn: (node: TreeNode) => boolean,
        autoExpand: boolean,
    ) {
        // if node passes function then it's visible
        let isVisible = filterFn(node)

        if (node.children) {
            // if one of node's children passes filter then this node is also visible
            node.children.forEach((child) => {
                if (this.filterNode(ids, child, filterFn, autoExpand)) {
                    isVisible = true
                }
            })
        }

        // mark node as hidden
        if (!isVisible) {
            ids.set(node.id, true)
        }

        // auto expand parents to make sure the filtered nodes are visible
        if (autoExpand && isVisible) {
            node.ensureVisible()
        }

        return isVisible
    }

    private setSingleActiveNode(node: TreeNode, active: boolean) {
        // Deactivate all other nodes:
        this.activeNodes
            .filter((activeNode) => activeNode !== node)
            .forEach((activeNode) => {
                this.fireEvent({ eventName: TREE_EVENTS.deactivate, node: activeNode })
            })

        if (active) {
            this.activeNodeIds = new Map([[node.id, true]])
        } else {
            this.activeNodeIds = new Map()
        }
    }

    private setMultiActiveNodes(node: TreeNode, active: boolean) {
        this.activeNodeIds.set(node.id, active)
    }
}

function canMoveNode(node: TreeNode, fromIndex: number, to: { parent: TreeNode, index: number }) {
    // same node:
    if (node.parent === to.parent && fromIndex === to.index) {
        return false
    }

    return !to.parent.isDescendantOf(node)
}
