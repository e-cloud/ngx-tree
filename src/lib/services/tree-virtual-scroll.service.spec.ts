import { inject, TestBed } from '@angular/core/testing'

import { TreeVirtualScroll } from './tree-virtual-scroll.service'

describe('TreeVirtualScrollService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TreeVirtualScroll],
        })
    })

    it('should be created', inject([TreeVirtualScroll], (service: TreeVirtualScroll) => {
        expect(service).toBeTruthy()
    }))
})
