import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TreeNodeContentWrapperComponent } from './tree-node-content-wrapper.component'

describe('TreeNodeContentWrapperComponent', () => {
    let component: TreeNodeContentWrapperComponent
    let fixture: ComponentFixture<TreeNodeContentWrapperComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                declarations: [TreeNodeContentWrapperComponent],
            })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(TreeNodeContentWrapperComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should be created', () => {
        expect(component).toBeTruthy()
    })
})
