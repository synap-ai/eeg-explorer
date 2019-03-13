import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { MediaDescription } from 'app/shared/media-description';

@Component({
  selector: 'app-media-description-form',
  templateUrl: './media-description-form.component.html',
  styleUrls: ['./media-description-form.component.css']
})
export class MediaDescriptionFormComponent implements OnInit {

  @Input() video: MediaDescription;

  isClass = true;

  mediaOptions: FormGroup;

  constructor(fb: FormBuilder) {
    this.mediaOptions = fb.group({
      title: null,
      youtube_id: null,
      category: null,
    });
  }

  ngOnInit() {
    if (this.video.title) { // if object has been set
      this.mediaOptions.setValue(this.video);
    }
  }

  save() {
    Object.assign(this.video, this.mediaOptions.value);
  }

}
