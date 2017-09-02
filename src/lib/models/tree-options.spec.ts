import { createTreeUIOptions, defaultUIOptions } from 'ngx-tree/models/tree-options'

describe('TreeDraggingTargetService', () => {
    let defaultRawOption
    beforeEach(() => {
        defaultRawOption = {}
    })

    it('should create a default tree UI options object with empty input', () => {
        const options = createTreeUIOptions()

        expect(options).toEqual(defaultUIOptions)
    })
})
