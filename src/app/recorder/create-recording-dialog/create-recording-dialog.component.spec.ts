import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRecordingDialogComponent } from './create-recording-dialog.component';

describe('CreateRecordingDialogComponent', () => {
  let component: CreateRecordingDialogComponent;
  let fixture: ComponentFixture<CreateRecordingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRecordingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRecordingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
