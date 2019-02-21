import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDescriptionFormComponent } from './media-description-form.component';

describe('MediaDescriptionFormComponent', () => {
  let component: MediaDescriptionFormComponent;
  let fixture: ComponentFixture<MediaDescriptionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaDescriptionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaDescriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
