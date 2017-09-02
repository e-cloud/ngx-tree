import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserTestingModule } from '@angular/platform-browser/testing'

import { createTreeDataOptions, TreeNode, TreeUIOptions } from '../../models'
import { TreeVirtualScroll } from '../../services/tree-virtual-scroll.service'
import { FakeTreeDragDirective, FakeTreeDropDirective } from '../tree-node-drop-slot/tree-node-drop-slot.component.spec'
import { TreeNodeWrapperComponent } from './tree-node-wrapper.component'

@Component({
    selector: 'ngx-tree-node-expander',
    template: '',
})
export class FakeTreeNodeExpanderComponent {
    @Input() node: TreeNode
}

@Component({
    selector: 'ngx-tree-node-content',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FakeTreeNodeContentComponent {
    @Input() options: TreeUIOptions
    @Input() node: TreeNode
    @Input() index: number
    @Input() template: TemplateRef<any>
}

describe('TreeNodeWrapperComponent', () => {
    let component: TreeNodeWrapperComponent
    let fixture: ComponentFixture<TreeNodeWrapperComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                imports: [
                    BrowserTestingModule,
                ],
                declarations: [
                    TreeNodeWrapperComponent,
                    FakeTreeNodeExpanderComponent,
                    FakeTreeNodeContentComponent,
                    FakeTreeDropDirective,
                    FakeTreeDragDirective,
                ],
                providers: [
                    TreeVirtualScroll,
                ]
            })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(TreeNodeWrapperComponent)
        component = fixture.componentInstance
        component.options = createTreeDataOptions()
        component.node = {} as any
        component.templates = {}
        fixture.detectChanges()
    })

    it('should be created', () => {
        expect(component).toBeTruthy()
    })
})
