import { TestappPage } from './app.po';

describe('testapp App', () => {
  let page: TestappPage;

  beforeEach(() => {
    page = new TestappPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
