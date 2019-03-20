import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlinkDetectorComponent } from './blink-detector.component';

describe('AnalysisComponent', () => {
  let component: BlinkDetectorComponent;
  let fixture: ComponentFixture<BlinkDetectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlinkDetectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlinkDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
