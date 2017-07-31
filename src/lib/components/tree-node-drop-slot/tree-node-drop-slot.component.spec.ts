import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeNodeDropSlotComponent } from './tree-node-drop-slot.component';

describe('TreeNodeDropSlotComponent', () => {
  let component: TreeNodeDropSlotComponent;
  let fixture: ComponentFixture<TreeNodeDropSlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeNodeDropSlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeNodeDropSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
