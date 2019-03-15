import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { MediaDescription } from 'app/shared/classes/media-description';

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
      this.mediaOptions.setValue(
        {
          title: this.video.title,
          youtube_id: this.video.youtube_id,
          category: this.video.category,
        }
      );
    }
  }

  save() {
    Object.assign(this.video, this.mediaOptions.value);
  }

}
