import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingTimerComponent } from './recording-timer.component';

describe('RecordingTimerComponent', () => {
  let component: RecordingTimerComponent;
  let fixture: ComponentFixture<RecordingTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
