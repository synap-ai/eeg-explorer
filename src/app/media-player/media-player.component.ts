import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.css']
})
export class MediaPlayerComponent implements OnInit {

  Player: YT.Player;
  private id = 'aircAruvnKk';

  constructor() { }

  ngOnInit() {
  }

  savePlayer(player) {
    this.Player = player;
  }
  onStateChange(event) {
    console.log('player state', event.data);
  }

  load(videoID: string) {
    this.Player.loadVideoById(videoID);
  }


}
