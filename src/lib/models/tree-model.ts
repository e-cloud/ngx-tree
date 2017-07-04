import { compact, find, first, isFunction, isString, last } from 'lodash'
import { Observer } from 'rxjs/Observer'
import { EventsMap, TREE_EVENTS } from '../constants/events'
import { TreeEvent } from './'
import { TreeNode } from './tree-node'
import { TreeOptions } from './tree-options.model'

export class TreeModel {
    static focusedTree: TreeModel = null

    roots: TreeNode[]
    expandedNodeIds: { [id: string]: boolean } = {}
    activeNodeIds: { [id: string]: boolean } = {}
    hiddenNodeIds: { [id: string]: boolean } = {}
    focusedNodeId: string = null
    virtualRoot: TreeNode
    nodeCache: Map<string, TreeNode> = new Map()

    get isFocused() {
        return TreeModel.focusedTree === this
    }

    get isEmptyTree() {
        return this.roots && this.roots.length === 0
    }

    get focusedNode() {
        return this.focusedNodeId ? this.getNodeById(this.focusedNodeId) : null
    }

    get expandedNodes() {
        const nodes = Object.keys(this.expandedNodeIds)
            .filter((id) => this.expandedNodeIds[id])
            .map((id) => this.getNodeById(id))

        return compact(nodes)
    }

    get activeNodes() {
        const nodes = Object.keys(this.activeNodeIds)
            .filter((id) => this.activeNodeIds[id])
            .map((id) => this.nodeCache.get(id))

        return compact(nodes)
    }

    constructor(
        private nodes: any[],
        public events: EventsMap,
        public options: TreeOptions = new TreeOptions(),
    ) {
        const virtualRootConfig = {
            virtual: true,
            // todo: determine to use fixed children field later
            [this.options.childrenField]: this.nodes,
        }

        this.virtualRoot = new TreeNode(virtualRootConfig, null, this, 0)

        this.roots = this.virtualRoot.children
    }

    addCache(node: TreeNode) {
        this.nodeCache.set(node.id, node)
    }

    updateOptions(options: TreeOptions) {
        this.options = options
    }

    // events
    fireEvent(event: TreeEvent) {
        // event.treeModel = this

        this.events[event.eventName].emit(event)
    }

    subscribe(eventName: string, fn: Observer<TreeEvent>) {
        this.events[eventName].subscribe(fn)
    }

    // getters
    getFocusedNode(): TreeNode {
        return this.focusedNode
    }

    getActiveNode(): TreeNode {
        return this.activeNodes[0]
    }

    getActiveNodes(): TreeNode[] {
        return this.activeNodes
    }

    getVisibleRoots() {
        return this.virtualRoot.visibleChildren
    }

    getFirstRoot(skipHidden = false) {
        return first(skipHidden ? this.getVisibleRoots() : this.roots)
    }

    getLastRoot(skipHidden = false) {
        return last(skipHidden ? this.getVisibleRoots() : this.roots)
    }

    // locating nodes
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

    getNodeById(id) {
        return this.nodeCache.get(id)
    }

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
        return this.expandedNodeIds[node.id]
    }

    isNodeHidden(node: TreeNode) {
        return this.hiddenNodeIds[node.id]
    }

    isNodeActive(node: TreeNode) {
        return this.activeNodeIds[node.id]
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
        this.expandedNodeIds[node.id] = isExpanded
    }

    setExpandedNode(node: TreeNode, isExpanded = true) {
        this.expandedNodeIds = Object.assign({}, this.expandedNodeIds, { [node.id]: isExpanded })
        this.fireEvent({ eventName: TREE_EVENTS.toggleExpander, node, isExpanded })
    }

    setHiddenNode(node: TreeNode, isHidden = true) {
        this.hiddenNodeIds = Object.assign({}, this.hiddenNodeIds, { [node.id]: isHidden })
    }

    setFocusedNode(node: TreeNode) {
        this.focusedNodeId = node ? node.id : null
    }

    setFocus(value: boolean) {
        TreeModel.focusedTree = value ? this : null
    }

    traverse(fn: (node: TreeNode) => any) {
        this.roots.forEach((root) => root.traverse(fn))
    }

    focusNextNode() {
        const previousNode = this.getFocusedNode()
        const nextNode = previousNode ? previousNode.findNextNode(true, true) : this.getFirstRoot(true)
        if (nextNode) {
            nextNode.focus()
        }
    }

    focusPreviousNode() {
        const previousNode = this.getFocusedNode()
        const nextNode = previousNode ? previousNode.findPreviousNode(true) : this.getLastRoot(true)
        if (nextNode) {
            nextNode.focus()
        }
    }

    focusDrillDown() {
        const previousNode = this.getFocusedNode()
        if (previousNode && previousNode.isCollapsed && previousNode.hasChildren) {
            previousNode.toggleExpanded()
        } else {
            const nextNode = previousNode ? previousNode.getFirstChild(true) : this.getFirstRoot(true)
            if (nextNode) {
                nextNode.focus()
            }
        }
    }

    focusDrillUp() {
        const previousNode = this.getFocusedNode()
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

    expandAll() {
        this.roots.forEach((root) => root.expandAll())
    }

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

        const ids = {}
        this.roots.forEach((node) => this.filterNode(ids, node, filterFn, autoShow))
        this.hiddenNodeIds = ids
        this.fireEvent({ eventName: TREE_EVENTS.changeFilter })
    }

    clearFilter() {
        this.hiddenNodeIds = {}
        this.fireEvent({ eventName: TREE_EVENTS.changeFilter })
    }

    moveNode(node: TreeNode, to: { parent: TreeNode, index: number }) {
        const fromIndex = node.index
        const fromParent = node.parent

        if (!canMoveNode(node, fromIndex, to)) {
            return
        }

        // If node doesn't have children - create children array
        if (!to.parent.getField('children')) {
            to.parent.setField('children', [])
        }

        node.remove()

        // Compensate for index if already removed from parent:
        const toIndex = (fromParent === to.parent && to.index > fromIndex) ? to.index - 1 : to.index

        to.parent.addChild(node.data, toIndex)

        this.fireEvent({
            eventName: TREE_EVENTS.moveNode,
            node,
            to: { parent: to.parent.data, index: toIndex },
        })
    }

    private filterNode(ids: { [id: string]: boolean }, node: TreeNode, filterFn: (node) => boolean, autoShow: boolean) {
        // if node passes function then it's visible
        let isVisible = filterFn(node)

        if (node.children) {
            // if one of node's children passes filter then this node is also visible
            node.children.forEach((child) => {
                if (this.filterNode(ids, child, filterFn, autoShow)) {
                    isVisible = true
                }
            })
        }

        // mark node as hidden
        if (!isVisible) {
            ids[node.id] = true
        }

        // auto expand parents to make sure the filtered nodes are visible
        if (autoShow && isVisible) {
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
            this.activeNodeIds = { [node.id]: true }
        } else {
            this.activeNodeIds = {}
        }
    }

    private setMultiActiveNodes(node: TreeNode, active: boolean) {
        this.activeNodeIds = Object.assign({}, this.activeNodeIds, { [node.id]: active })
    }
}

function canMoveNode(node: TreeNode, fromIndex: number, to: { parent: TreeNode, index: number }) {
    // same node:
    if (node.parent === to.parent && fromIndex === to.index) {
        return false
    }

    return !to.parent.isDescendantOf(node)
}
