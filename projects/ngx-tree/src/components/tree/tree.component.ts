import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
} from '@angular/core'
import each from 'lodash-es/each'
import { EventsMap, TREE_EVENTS } from '../../constants/events'
import {
    createTreeUIOptions,
    IAllowDragFn,
    IAllowDropFn,
    ILevelPaddingFn,
    TreeDataOptions, TreeEvent,
    TreeModel,
    TreeNode,
    TreeUIOptions,
} from '../../models'
import { TreeDraggingTargetService } from '../../services/tree-dragging-target.service'
import { TreeNodeChildrenComponent } from '../tree-node-children/tree-node-children.component'
import { TreeViewportComponent } from '../tree-viewport/tree-viewport.component'

@Component({
    selector: 'ngx-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements OnChanges, OnDestroy {
    emitterMap: EventsMap
    treeModel: TreeModel = null as any
    UIOptions: TreeUIOptions
    refreshTree = false

    /**
     * source data
     */
    @Input() nodes: any[]
    /**
     * id of the node to be focused on
     */
    @Input() focusTarget: string
    /**
     * id of the node to be activated
     */
    @Input() activateTarget: string
    @Input() dataOptions: TreeDataOptions

    @Input() allowDrag: boolean | IAllowDragFn
    @Input() allowDrop: boolean | IAllowDropFn
    @Input() levelPadding: number | ILevelPaddingFn
    @Input() useVirtualScroll: boolean
    @Input() referenceItemHeight: number
    @Input() auditViewportUpdate?: number
    @Input() nodeClass: (node: TreeNode) => string
    @Input() enableAnimation = true
    @Input() keepNodesExpanded = false

    @Output() expand = new EventEmitter<TreeEvent>()
    @Output() collapse = new EventEmitter<TreeEvent>()
    @Output() toggleExpander = new EventEmitter<TreeEvent>()
    @Output() activate = new EventEmitter<TreeEvent>()
    @Output() deactivate = new EventEmitter<TreeEvent>()
    @Output() focus = new EventEmitter<TreeEvent>()
    @Output() blur = new EventEmitter<TreeEvent>()
    @Output() initialized = new EventEmitter<TreeEvent>()
    @Output() moveNode = new EventEmitter<TreeEvent>()
    @Output() loadChildren = new EventEmitter<TreeEvent>()
    @Output() changeFilter = new EventEmitter<TreeEvent>()
    @Output() addNode = new EventEmitter<TreeEvent>()
    @Output() removeNode = new EventEmitter<TreeEvent>()

    @HostBinding('class.ngx-tree') className = true

    @ContentChild('loadingTemplate',  {static: false}) loadingTemplate: TemplateRef<any>
    @ContentChild('expanderTemplate',  {static: false}) expanderTemplate: TemplateRef<any>
    @ContentChild('treeNodeTemplate',  {static: false}) treeNodeTemplate: TemplateRef<any>
    @ContentChild('treeNodeWrapperTemplate',  {static: false}) treeNodeWrapperTemplate: TemplateRef<any>
    @ContentChild('treeNodeFullTemplate',  {static: false}) treeNodeFullTemplate: TemplateRef<any>

    @ViewChild('viewport', { static: true }) viewportComponent: TreeViewportComponent
    @ViewChild('root', { static: true }) root: TreeNodeChildrenComponent

    constructor(public treeDraggingTargetService: TreeDraggingTargetService) {
        this.emitterMap = (<(keyof typeof TREE_EVENTS)[]>Object.keys(TREE_EVENTS)).reduce((map, name) => {
            if (!this.hasOwnProperty(name)) {
                throw new TypeError(`Unmatched events: [${name}]`)
            }

            this[name] = map[name] = new EventEmitter()

            return map
        }, {} as EventsMap)

        this.UIOptions = createTreeUIOptions()
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.nodes && changes.nodes.currentValue) {
            const oldTreeModel = this.treeModel
            this.treeModel = new TreeModel(changes.nodes.currentValue, this.emitterMap, this.dataOptions)
            if (oldTreeModel && this.keepNodesExpanded) {
                oldTreeModel.expandedNodes.forEach(node => {
                    this.treeModel!.setExpandedNodeInPlace(node)
                })
            }
            if (!changes.nodes.isFirstChange()) {
                this.refreshTree = true
            }
        } else if (changes.dataOptions && changes.dataOptions.currentValue && this.treeModel) {
            this.treeModel.updateOptions(changes.dataOptions.currentValue)
        }

        if (changes.focusTarget && changes.focusTarget.currentValue && this.treeModel) {
            this.treeModel.focusNode(this.focusTarget)
        }

        if (changes.activateTarget && changes.activateTarget.currentValue && this.treeModel) {
            this.treeModel.activateNode(this.activateTarget)
        }

        if (changes.allowDrag
            || changes.allowDrop
            || changes.levelPadding
            || changes.useVirtualScroll
            || changes.nodeClass
            || changes.referenceItemHeight
            || changes.auditViewportUpdate) {
            this.UIOptions = createTreeUIOptions({
                allowDrag: this.allowDrag,
                allowDrop: this.allowDrop,
                levelPadding: this.levelPadding,
                useVirtualScroll: this.useVirtualScroll,
                referenceItemHeight: this.referenceItemHeight,
                auditViewportUpdate: this.auditViewportUpdate,
                nodeClass: this.nodeClass,
            })
        }
    }

    ngOnDestroy() {
        each(this.emitterMap, function (emitter) {
            emitter.complete()
        })
    }

    @HostListener('body: keydown', ['$event'])
    onKeydown($event: KeyboardEvent) {
        if (!this.treeModel.isFocused) {
            return
        }

        if (['input', 'textarea'].includes(document.activeElement!.tagName.toLowerCase())) {
            return
        }

        const focusedNode = this.treeModel.focusedNode!

        this.treeModel.performKeyAction(focusedNode, $event)
    }

    @HostListener('body: mousedown', ['$event'])
    onMousedown($event: MouseEvent) {
        const insideClick = (<HTMLElement>$event.target)!.closest('ngx-tree')

        if (!insideClick) {
            this.treeModel.setFocus(false)
        }
    }

    sizeChanged() {
        this.viewportComponent.setViewport()
    }

}
