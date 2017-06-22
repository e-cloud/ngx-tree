import { inject, TestBed } from '@angular/core/testing'

import { TreeModel } from './tree-model.service'

describe('TreeModelService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TreeModel],
        })
    })

    it('should be created', inject([TreeModel], (service: TreeModel) => {
        expect(service).toBeTruthy()
    }))
})
