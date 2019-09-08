import { ElementRef } from '@angular/core'
import first from 'lodash-es/first'
import last from 'lodash-es/last'
import pullAt from 'lodash-es/pullAt'
import without from 'lodash-es/without'
import { TREE_EVENTS } from '../constants/events'
import { DragAndDropEvent, TreeEvent } from './events'
import { TreeModel } from './tree-model'
import { AvailableMouseEvents, CustomFieldNames, CustomFieldPrefix, TreeDataOptions } from './tree-options'

export class TreeNode {
    /**
     * The children of the node.
     * By default is determined by 'node.data.children', unless stated otherwise in the options
     */
    children: TreeNode[]
    /**
     * top edge position relative to the top edge of scroll area
     */
    position = -1
    /**
     * the visual height of the node
     */
    height = 0
    loadingChildren = false
    elementRef: ElementRef | null

    get isHidden() {
        return this.treeModel.isNodeHidden(this)
    }

    get isExpanded() {
        return this.treeModel.isNodeExpanded(this)
    }

    get isCollapsed() {
        return !this.isExpanded
    }

    get isActive() {
        return this.treeModel.isNodeActive(this)
    }

    get isFocused() {
        return this.treeModel.isNodeFocused(this)
    }

    get isLeaf() {
        return !this.hasChildren
    }

    get isRoot() {
        return this.parent === null
    }

    /**
     * Level in the tree (starts from 1).
     */
    get level(): number {
        return this.parent ? this.parent.level + 1 : 0
    }

    /**
     * Path in the tree: Array of IDs.
     */
    get path(): string[] {
        return this.parent ? [...this.parent.path, this.id] : []
    }

    // helper get functions:
    get hasChildren() {
        return !!(this.data.hasChildren || (this.children && this.children.length > 0))
    }

    // helper get functions:
    get hasVisibleChildren() {
        return !!(this.data.hasChildren || (this.visibleChildren && this.visibleChildren.length > 0))
    }

    // proxy functions:
    get options(): TreeDataOptions {
        return this.treeModel.options
    }

    // field accessors:
    /**
     * The value of the node's field that is used for displaying its content.
     * By default 'name', unless stated otherwise in the options
     */
    get displayField() {
        return this.getField('display')
    }

    /**
     * A unique key of this node among its siblings.
     * By default it's the 'id' of the original node, unless stated otherwise in options.idField
     */
    get id() {
        return this.getField('id')
    }

    set id(value) {
        this.setField('id', value)
    }

    get visibleChildren() {
        return (this.children || []).filter((node) => !node.isHidden)
    }

    constructor(
        /**
         * any - Pointer to the original data.
         *
         */
        public data: any,
        /**
         * TreeNode - Parent node
         */
        public parent: TreeNode | null,
        public treeModel: TreeModel,
        /**
         * index of the node inside its parent's children
         */
        public index: number,
    ) {
        // Make sure there's a unique id without overriding existing ids to work with immutable data structures
        if (this.id === undefined || this.id === null) {
            this.id = uuid()
        }

        treeModel.addCache(this)
        if (data[this.options.isExpandedField!]) {
            treeModel.setExpandedNodeInPlace(this)
        }

        if (this.getField('children')) {
            this.initChildren()
        }
    }

    /**
     * Fire an event to the renderer of the tree (if it was registered)
     */
    fireEvent(event: TreeEvent) {
        this.treeModel.fireEvent(event)
    }

    getField(key: CustomFieldPrefix) {
        return this.data[this.options[<CustomFieldNames>`${key}Field`]!]
    }

    setField(key: string, value: any) {
        this.data[this.options[<CustomFieldNames>`${key}Field`]!] = value
    }

    onDrop($event: DragAndDropEvent) {
        this.mouseAction('drop', $event.event, {
            from: $event.element,
            to: { parent: this, index: 0, dropOnNode: true },
        })
    }

    // traversing:
    findAdjacentSibling(steps: number, skipHidden = false) {
        return this.getParentChildren(skipHidden)[this.index + steps]
    }

    /**
     * @param skipHidden whether to skip hidden nodes
     * @returns next sibling (or null)
     */
    findNextSibling(skipHidden = false) {
        return this.findAdjacentSibling(+1, skipHidden)
    }

    /**
     * @param skipHidden whether to skip hidden nodes
     * @returns previous sibling (or null)
     */
    findPreviousSibling(skipHidden = false) {
        return this.findAdjacentSibling(-1, skipHidden)
    }

    /**
     * @param skipHidden whether to skip hidden nodes
     * @returns first child (or null)
     */
    getFirstChild(skipHidden = false) {
        const children = skipHidden ? this.visibleChildren : this.children

        return first(children || [])
    }

    /**
     * @param skipHidden whether to skip hidden nodes
     * @returns last child (or null)
     */
    getLastChild(skipHidden = false) {
        const children = skipHidden ? this.visibleChildren : this.children

        return last(children || [])
    }

    /**
     * Finds the visually next node in the tree.
     * @param goInside whether to look for children or just siblings
     * @param skipHidden
     * @returns next node.
     */
    findNextNode(goInside = true, skipHidden = false): false | TreeNode | null {
        return goInside && this.isExpanded && this.getFirstChild(skipHidden) ||
            this.findNextSibling(skipHidden) ||
            this.parent && this.parent.findNextNode(false, skipHidden)
    }

    /**
     * Finds the visually previous node in the tree.
     * @param skipHidden whether to skip hidden nodes
     * @returns previous node.
     */
    findPreviousNode(skipHidden = false):  TreeNode | null {
        const previousSibling = this.findPreviousSibling(skipHidden)
        if (!previousSibling) {
            return this.parent
        }

        return previousSibling.getLastOpenDescendant(skipHidden)
    }

    /**
     * @returns      true if this node is a descendant of the parameter node
     */
    isDescendantOf(node: TreeNode): boolean {
        if (this === node) {
            return true
        } else {
            return !!this.parent && this.parent.isDescendantOf(node)
        }
    }

    // helper methods:
    loadChildren() {
        if (!this.options.getChildren) {
            return Promise.resolve() // Not getChildren method - for using redux
        }

        this.loadingChildren = true

        return Promise.resolve(this.options.getChildren(this))
            .then((children) => {
                if (children) {
                    this.setField('children', children)
                    this.initChildren()
                }
            })
            .then(() => {
                this.loadingChildren = false
                this.fireEvent({
                    eventName: TREE_EVENTS.loadChildren,
                    node: this,
                })
            })
    }

    /**
     * Expands the node
     */
    expand() {
        if (!this.isExpanded) {
            return this.toggleExpanded()
        }

        return this
    }

    /**
     * Collapses the node
     */
    collapse() {
        if (this.isExpanded) {
            // as collapse operation doesn't introduce side effect, not need to
            this.treeModel.setExpandedNode(this, false)
        }

        return this
    }

    /**
     * Invokes a method for every node under this one - async depth first(preorder)
     * @param fn  a function that receives the node
     */
    traverseAsync(fn: (node: TreeNode) => any) {
        const result = fn(this)
        if (result instanceof Promise) {
            result.then(() => {
                if (this.children) {
                    this.children.forEach((child) => child.traverseAsync(fn))
                }
            })
        } else if (this.children) {
            this.children.forEach((child) => child.traverseAsync(fn))
        }
    }

    /**
     * Invokes a method for every node under this one - depth first(preorder)
     * @param fn  a function that receives the node
     */
    traverse(fn: (node: TreeNode) => any) {
        fn(this)

        if (this.children) {
            this.children.forEach((child) => child.traverse(fn))
        }
    }

    /**
     * expand all nodes under this one
     */
    expandAll() {
        this.traverseAsync((node) => node.expand())
    }

    /**
     * collapse all nodes under this one
     */
    collapseAll() {
        this.traverse((node) => node.collapse())
    }

    /**
     * Expands / Collapses the node
     */
    toggleExpanded(isExpanded = !this.isExpanded) {
        if (this.hasChildren) {
            this.treeModel.setExpandedNode(this, isExpanded)

            if (!this.children && this.hasChildren && isExpanded) {
                return this.loadChildren()
            }
        }

        return this
    }

    setActive(isActive = true, isMulti = false) {
        this.treeModel.setActiveNode(this, isActive, isMulti)

        return this
    }

    /**
     * @param isHidden  if true makes the node hidden, otherwise visible
     */
    setHidden(isHidden = true) {
        this.treeModel.setHiddenNode(this, isHidden)

        return this
    }

    /**
     * Activates / Deactivates the node (selects / deselects)
     */
    toggleActivated(isMulti = false) {
        this.setActive(!this.isActive, isMulti)

        return this
    }

    setActiveAndVisible(isMulti = false) {
        this.setActive(true, isMulti)
            .ensureVisible()

        this.scrollIntoView()

        return this
    }

    /**
     * Expands all ancestors of the node
     */
    ensureVisible() {
        if (this.parent) {
            this.parent.expand()
            this.parent.ensureVisible()
        }

        return this
    }

    scrollIntoView(force = false, scrollToMiddle?: boolean) {
        this.treeModel.scrollIntoView(this, force, scrollToMiddle)
    }

    /**
     * Focus on the node
     */
    focus(scroll = true) {
        const previousNode = this.treeModel.focusedNode
        this.treeModel.setFocusedNode(this)
        if (scroll) {
            this.scrollIntoView()
        }
        if (previousNode) {
            this.fireEvent({ eventName: TREE_EVENTS.blur, node: previousNode })
        }
        this.fireEvent({ eventName: TREE_EVENTS.focus, node: this })

        return this
    }

    /**
     * Blur (unfocus) the node
     */
    blur() {
        const previousNode = this.treeModel.focusedNode
        this.treeModel.setFocusedNode(null)
        if (previousNode) {
            this.fireEvent({ eventName: TREE_EVENTS.blur, node: this })
        }

        return this
    }

    /**
     * Hides the node
     */
    hide() {
        this.setHidden(true)

        return this
    }

    /**
     * Makes the node visible
     */
    show() {
        this.setHidden(false)

        return this
    }

    addChild(data: any, index: number) {
        const node = new TreeNode(data, this, this.treeModel, index)

        // If node doesn't have children - create children array
        if (!this.getField('children')) {
            this.setField('children', [])
        }

        if (this.children) {
            this.getField('children').splice(index, 0, data)
            this.children.splice(index, 0, node)
            this.children = this.children.slice()
        } else {
            this.getField('children').push(data)
            this.children = [node]
        }

        this.reCalcChildrenIndices(index)

        this.fireEvent({ eventName: TREE_EVENTS.addNode, node })
    }

    appendChild(data: any) {
        this.addChild(data, this.children ? this.children.length : 0)
    }

    remove() {
        this.parent!.removeChild(this)
    }

    removeChild(node: TreeNode) {
        pullAt(this.getField('children'), node.index)
        this.children = without(this.children, node)

        this.reCalcChildrenIndices(0)

        this.fireEvent({ eventName: TREE_EVENTS.removeNode, node })

        if (node.isFocused) {
            this.treeModel.setFocusedNode(null)
            this.treeModel.setActiveNode(node, false)
        }

        if (node.isExpanded) {
            this.treeModel.setExpandedNodeInPlace(node, false)
        }

        node.treeModel = null as any
        node.elementRef = null
    }

    mouseAction(actionName: AvailableMouseEvents, $event: any, data: any = null) {
        this.treeModel.setFocus(true)

        const actionMapping = this.options.actionMapping!.mouse!
        const action = actionMapping[actionName]

        if (action) {
            action(this.treeModel, this, $event, data)
        }
    }

    private reCalcChildrenIndices(offset: number) {
        this.children.slice(offset).forEach((child, index) => {
            child.index = index + offset
        })
    }

    private initChildren() {
        this.children = this.getField('children')
            .map((data: any, index: number) => new TreeNode(data, this, this.treeModel, index))
    }

    private getLastOpenDescendant(skipHidden = false): TreeNode {
        const lastChild = this.getLastChild(skipHidden)

        return (this.isCollapsed || !lastChild)
            ? this
            : lastChild.getLastOpenDescendant(skipHidden)
    }

    private getParentChildren(skipHidden = false): TreeNode[] {
        return this.parent
            ? (skipHidden ? this.parent.visibleChildren : this.parent.children)
            : []
    }
}

let _uuid = 0

function uuid() {
    return `ngx-tid-${_uuid++}`
}
