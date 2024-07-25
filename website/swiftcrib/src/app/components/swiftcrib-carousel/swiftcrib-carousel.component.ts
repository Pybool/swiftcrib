import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-swiftcrib-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './swiftcrib-carousel.component.html',
  styleUrl: './swiftcrib-carousel.component.scss',
})
export class SwiftcribCarouselComponent {
  public serverUrl:string = environment.api;
  @Input() attachments: { type?: string; url?: string }[] = [
    {
        "type": "video",
        "url": "/listing-attachments/04-07-2024/1fed6204-616c-49f2-a2be-155821c18234-4301618-hd_1920_1080_30fps.mp4"
    },
    {
        "type": "image",
        "url": "/listing-attachments/04-07-2024/0f34a4ac-05ce-4c51-822a-4a2f41046ce9-pexels-binyaminmellish-1396132.jpg"
    },
    {
        "type": "image",
        "url": "/listing-attachments/04-07-2024/96abb5c9-04fd-4817-8aa5-d9856cce9cbc-pexels-binyaminmellish-1396122.jpg"
    },
    {
        "type": "image",
        "url": "/listing-attachments/04-07-2024/73b08415-d17f-42ee-87d8-0c6259348721-pexels-arabiclogos-453201.jpg"
    }
]
  public videoState?: string;

  ngAfterViewInit(): void {}

  addPlayerIconOpacity() {
    const playerIcon = document.querySelector('.play-icon-wrapper') as any;
    const leftCarouselControl = document.querySelector(
      '.carousel-control-left'
    ) as any;
    const rightCarouselControl = document.querySelector(
      '.carousel-control-right'
    ) as any;
    if (playerIcon) {
      playerIcon.style.opacity = '1';
      leftCarouselControl.style.opacity = '1';
      rightCarouselControl.style.opacity = '1';
    }
  }

  removePlayerIconOpacity() {
    const playerIcon = document.querySelector('.play-icon-wrapper') as any;
    const leftCarouselControl = document.querySelector(
      '.carousel-control-left'
    ) as any;
    const rightCarouselControl = document.querySelector(
      '.carousel-control-right'
    ) as any;
    if (playerIcon) {
      playerIcon.style.opacity = '0';
      leftCarouselControl.style.opacity = '0';
      rightCarouselControl.style.opacity = '0';
    }
  }

  async playActiveVideo() {
    // console.log(this.dispalyedMediaType);
    // if (this.videoState !== 'playing') {
    //   this.dispalyedMediaType?.play();
    // } else {
    //   this.dispalyedMediaType?.pause();
    // }

    // const playerIcon = document.querySelector('.play-icon-wrapper') as any;
    // playerIcon.style.opacity = '0';
  }

  removeMediaLoader() {
    setTimeout(() => {
      // this.isMediaLoading = false;
    }, 2000);
  }

  onImageLoad() {
    this.removeMediaLoader();
  }

  onVideoLoad() {
    this.removeMediaLoader();
  }

  onPlay() {
    this.videoState = 'playing';
    this.addPlayerIconOpacity();
  }

  onPause() {
    this.videoState = 'paused';
  }

  onEnded() {
    this.videoState = 'ended';
  }

  

}
