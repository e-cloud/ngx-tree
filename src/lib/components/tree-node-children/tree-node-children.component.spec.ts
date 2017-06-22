import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TreeNodeChildrenComponent } from './tree-node-children.component'

describe('TreeNodeChildrenComponent', () => {
    let component: TreeNodeChildrenComponent
    let fixture: ComponentFixture<TreeNodeChildrenComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                declarations: [TreeNodeChildrenComponent],
            })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(TreeNodeChildrenComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should be created', () => {
        expect(component).toBeTruthy()
    })
})
