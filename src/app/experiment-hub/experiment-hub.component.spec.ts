import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentHubComponent } from './experiment-hub.component';

describe('ExperimentHubComponent', () => {
  let component: ExperimentHubComponent;
  let fixture: ComponentFixture<ExperimentHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperimentHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
