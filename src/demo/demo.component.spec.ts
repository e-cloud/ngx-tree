import { TestBed, async } from '@angular/core/testing';

import { DemoComponent } from './demo.component';

describe('DemoComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          DemoComponent
      ],
    }).compileComponents();
  }));

  it('should create the demo', async(() => {
    const fixture = TestBed.createComponent(DemoComponent);
    const demo = fixture.debugElement.componentInstance;
    expect(demo).toBeTruthy();
  }));

  it(`should have as title 'demo'`, async(() => {
    const fixture = TestBed.createComponent(DemoComponent);
    const demo = fixture.debugElement.componentInstance;
    expect(demo.title).toEqual('demo');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(DemoComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to demo!!');
  }));
});
