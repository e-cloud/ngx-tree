import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TreeLoadingComponent } from './tree-loading.component'

describe('TreeLoadingComponent', () => {
    let component: TreeLoadingComponent
    let fixture: ComponentFixture<TreeLoadingComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                declarations: [TreeLoadingComponent],
            })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(TreeLoadingComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should be created', () => {
        expect(component).toBeTruthy()
    })
})
