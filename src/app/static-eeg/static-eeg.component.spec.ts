import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticEegComponent } from './static-eeg.component';

describe('StaticEegComponent', () => {
  let component: StaticEegComponent;
  let fixture: ComponentFixture<StaticEegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaticEegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticEegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
