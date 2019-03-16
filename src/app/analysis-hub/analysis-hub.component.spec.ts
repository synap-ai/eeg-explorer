import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisHubComponent } from './analysis-hub.component';

describe('AnalysisHubComponent', () => {
  let component: AnalysisHubComponent;
  let fixture: ComponentFixture<AnalysisHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysisHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
