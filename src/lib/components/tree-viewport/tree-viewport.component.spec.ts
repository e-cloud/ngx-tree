import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TreeViewportComponent } from './tree-viewport.component'

describe('TreeViewportComponent', () => {
    let component: TreeViewportComponent
    let fixture: ComponentFixture<TreeViewportComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                declarations: [TreeViewportComponent],
            })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(TreeViewportComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should be created', () => {
        expect(component).toBeTruthy()
    })
})
