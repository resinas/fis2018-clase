import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableContactComponent } from './editable-contact.component';

describe('EditableContactComponent', () => {
  let component: EditableContactComponent;
  let fixture: ComponentFixture<EditableContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
