import {
    Component,
    ContentChild,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core'
import 'element-closest'
import { pick } from 'lodash'
import { TreeNode } from '../../models/tree-node'
import { TreeOptions } from '../../models/tree-options.model'
import { TreeModel } from '../../services/tree-model.service'
import { TreeViewportComponent } from '../tree-viewport/tree-viewport.component'

@Component({
    selector: 'ngx-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnChanges {
    @ContentChild('loadingTemplate') loadingTemplate: TemplateRef<any>
    @ContentChild('treeNodeTemplate') treeNodeTemplate: TemplateRef<any>
    @ContentChild('treeNodeWrapperTemplate') treeNodeWrapperTemplate: TemplateRef<any>
    @ContentChild('treeNodeFullTemplate') treeNodeFullTemplate: TemplateRef<any>

    @ViewChild('viewport') viewportComponent: TreeViewportComponent

    @Input() nodes: TreeNode[]
    @Input() options: TreeOptions
    @Input() focused

    @Output() expand
    @Output() collapse
    @Output() toggleExpander
    @Output() activate
    @Output() deactivate
    @Output() focus
    @Output() blur
    @Output() initialized
    @Output() moveNode
    @Output() loadChildren
    @Output() changeFilter

    constructor(
        public treeModel: TreeModel,
    ) {
        treeModel.eventNames.forEach((name) => this[name] = new EventEmitter())
    }

    @HostListener('body: keydown', ['$event'])
    onKeydown($event) {
        if (!this.treeModel.isFocused) {
            return
        }

        if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
            return
        }

        const focusedNode = this.treeModel.getFocusedNode()

        this.treeModel.performKeyAction(focusedNode, $event)
    }

    @HostListener('body: mousedown', ['$event'])
    onMousedown($event) {
        const insideClick = $event.target.closest('ngx-tree')

        if (!insideClick) {
            this.treeModel.setFocus(false)
        }
    }

    ngOnChanges(changes) {
        this.treeModel.setData({
            options: changes.options && changes.options.currentValue,
            nodes: changes.nodes && changes.nodes.currentValue,
            events: pick(this, this.treeModel.eventNames),
        })
    }

    sizeChanged() {
        this.viewportComponent.setViewport()
    }

}
