import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityCheckDialogComponent } from './security-check-dialog.component';

describe('SecurityCheckDialogComponent', () => {
  let component: SecurityCheckDialogComponent;
  let fixture: ComponentFixture<SecurityCheckDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityCheckDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityCheckDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
