import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserTestingModule } from '@angular/platform-browser/testing'

import { createTreeUIOptions, TreeNode, TreeUIOptions } from '../../models/index'
import { TreeVirtualScroll, VIRTUAL_SCROLL_NODE_HEIGHT_QUOTA } from '../../services/tree-virtual-scroll.service'
import { TreeNodeWrapperComponent } from './tree-node-wrapper.component'

@Component({
    selector: 'ngx-tree-node-expander',
    template: '',
})
export class FakeTreeNodeExpanderComponent {
    @Input() options: TreeUIOptions
    @Input() node: TreeNode
    @Input() index: number
    @Input() template: TemplateRef<any>
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
                ],
                providers: [
                    TreeVirtualScroll,
                    {
                        provide: VIRTUAL_SCROLL_NODE_HEIGHT_QUOTA,
                        useValue: 5,
                    },
                ],
            })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(TreeNodeWrapperComponent)
        component = fixture.componentInstance
        component.options = createTreeUIOptions()
        component.node = {} as any
        component.templates = <any>{}
        fixture.detectChanges()
    })

    it('should be created', () => {
        expect(component).toBeTruthy()
    })
})
