import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectHubComponent } from './subject-hub.component';

describe('SubjectHubComponent', () => {
  let component: SubjectHubComponent;
  let fixture: ComponentFixture<SubjectHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
