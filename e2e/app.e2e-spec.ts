import { TestPPage } from './app.po'

describe('ngx-tree Demo', () => {
    let page: TestPPage

    beforeEach(() => {
        page = new TestPPage()
    })

    it('should display welcome message', () => {
        page.navigateTo()
        expect(page.getParagraphText()).toEqual('Welcome to demo!!')
    })
})
