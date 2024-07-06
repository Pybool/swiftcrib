import { Component, OnDestroy } from '@angular/core';
import { SwiftcribHeaderComponent } from '../../components/swiftcrib-header/swiftcrib-header.component';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapComponent } from '../../components/map/map.component';
import { SwiftcribCarouselComponent } from '../../components/swiftcrib-carousel/swiftcrib-carousel.component';
import { SwiftcribFooterComponent } from '../../components/swiftcrib-footer/swiftcrib-footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { HttpClientModule } from '@angular/common/http';
import { take } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModalComponent } from '../../components/share-modal/share-modal.component';
import { IDefaultHttpResponse } from '../../interfaces/common.interface';
let self: any;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
interface IcontactUs {
  name?: string;
  phone?: string;
  email?: string;
  url?: string;
  message?: string;
}
@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    SwiftcribHeaderComponent,
    CommonModule,
    GoogleMapsModule,
    MapComponent,
    SwiftcribCarouselComponent,
    SwiftcribFooterComponent,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ShareModalComponent,
  ],
  providers: [AuthService, ListingService],
  templateUrl: './old.html',
  styleUrl: './old.scss',
})
export class PropertyDetailsComponent implements OnDestroy {
  public routes$: any;
  public slug = '';
  public property: any = {};
  public showNotFound: boolean = false;
  public serverUrl: string = environment.api;
  public mediaToDisplay: { type: string; url: string }[] = [];
  public isMediaLoading: boolean = false;
  public lastSpaceId: string = '';
  public user: any;
  public bookMarks: any[] = [];
  public defaultEnquiryText: string = '';
  public contactUs: IcontactUs = {
    email: '',
    name: '',
    phone: '',
    message: '',
    url: '',
  };
  public dispalyedMediaType: any;
  public videoState: string = 'ended';
  public allMedia: { type: string; url: string }[] = [];
  public amenitiesToDisplay:any[] = []

  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    self = this;
    this.user = this.authService.retrieveUser();
    this.routes$ = this.route.params.subscribe((params) => {
      this.slug = params['slug'];
      this.listingService
        .fetchProperty(this.slug)
        .pipe(take(1))
        .subscribe(
          (response: IDefaultHttpResponse) => {
            console.log(response);
            if (response?.status) {
              setTimeout(() => {
                this.removeSkeleton('skeleton-box');
              }, 500);
              this.property = response.data;
              this.property.spaces = this.property.spaces;
              this.amenitiesToDisplay = this.property.amenities || [];
              this.mediaToDisplay = this.property.listingMedia;
              this.defaultEnquiryText = `I'm interested in the two-bedroom flat at ${this.property.address}. Could you please provide details on the rent, availability, and viewing schedule?`;
              this.contactUs.message = this.defaultEnquiryText;
              try {
                this.bookMarks =
                  JSON.parse(
                    localStorage.getItem('swiftcrib-bookmark') as string
                  ) || [];
              } catch {
                this.bookMarks = [];
              }
              this.mergeAllMedia();
            } else {
              this.showNotFound = true;
            }
          },
          (error: any) => {
            console.log(error);
            this.showNotFound = true;
          }
        );
    });
  }

  public mergeAllMedia() {
    this.allMedia.push(...this.mediaToDisplay);
    for (let space of this.property.spaces) {
      this.allMedia.push(...space.spaceMedia);
    }
  }

  setMediaToDisplay(spaceId: string, media: { type: string; url: string }[], amenities:any[]=[]) {
    console.log("amenities ",amenities)
    if (this.lastSpaceId !== spaceId || spaceId == 'all') {
      this.isMediaLoading = true;
      this.mediaToDisplay = media;
      this.amenitiesToDisplay = amenities || [];
      this.lastSpaceId = spaceId;
      try {
        this.dispalyedMediaType?.pause();
      } catch {}
      this.videoState = 'ended';
      this.removePlayerIconOpacity();
      setTimeout(() => {
        this.initializeCarousel();
      }, 500);
    }
  }

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
    console.log(this.dispalyedMediaType);
    if (this.videoState !== 'playing') {
      this.dispalyedMediaType?.play();
    } else {
      this.dispalyedMediaType?.pause();
    }

    const playerIcon = document.querySelector('.play-icon-wrapper') as any;
    playerIcon.style.opacity = '0';
  }

  removeMediaLoader() {
    setTimeout(() => {
      this.isMediaLoading = false;
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

  stopVideo() {
    try {
      if (this.dispalyedMediaType?.tagName == 'VIDEO') {
        this.dispalyedMediaType?.pause();
        this.dispalyedMediaType.currentTime = 0;
        this.onEnded();
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  localBookMark(listing: any) {
    localStorage.removeItem('swiftcrib-bookmark');
    const listingId = listing._id;
    if (this.isBookMarked(listingId)) {
      this.bookMarks = this.bookMarks.filter(
        (property: any) => property._id !== listingId
      );
    } else {
      this.bookMarks.push(listing);
    }

    if (this.user) {
      console.log('Saving to backend');
      this.listingService
        .bookMarkListing(listingId)
        .pipe(take(1))
        .subscribe(
          (response: IDefaultHttpResponse) => {
            if (!response.status) {
              alert(
                'Failed to bookmark property at this time, try again later'
              );
            }
          },
          (error: any) => {
            alert('Failed to bookmark property at this time, try again later');
          }
        );
    } else {
      console.log('Saving to local storage');
      localStorage.setItem(
        'swiftcrib-bookmark',
        JSON.stringify(this.bookMarks)
      );
    }
  }

  isBookMarked(propertyId: string) {
    return this.bookMarks?.some(
      (property: any) => property?._id === propertyId
    );
  }

  isInvalidEmail(email: any) {
    try {
      if (email.trim().length > 0) {
        if (!emailRegex.test(email)) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  isValidNigerianPhoneNumber(phoneNumber: string | undefined) {
    const cleaned = phoneNumber!.replace(/[\s-()]/g, '');
    const regex = /^(?:\+234|0)[789][01]\d{8}$/;

    return regex.test(cleaned);
  }

  contactButtonDisable() {
    const nameValid = this.contactUs.name!.trim()!?.length > 1;
    const emailValid = !this.isInvalidEmail(this.contactUs.email);
    const phoneValid = this.isValidNigerianPhoneNumber(this.contactUs!.phone);
    const messageValid = this.contactUs.message!.trim()!?.length > 20;
    return !(nameValid && emailValid && phoneValid && messageValid);
  }

  submitContactUs() {
    this.contactUs.url = `${environment.frontendUrl}/property/${this.property.slug}`;
    this.listingService
      .makePropertyEnquiry(this.contactUs)
      .pipe(take(1))
      .subscribe((response: IDefaultHttpResponse) => {
        alert(response.message);
      });
    this.contactUs = {
      email: '',
      name: '',
      phone: '',
      message: this.contactUs.message,
      url: '',
    };
    console.log('Contactus Payload ', this.contactUs);
  }

  toggleShareModal() {
    this.contactUs.url = `${environment.frontendUrl}/property/${this.property.slug}`;
    const shareModal = document.querySelector('.share-modal') as any;
    if (shareModal) {
      shareModal.classList.toggle('show');
    }
  }

  ngAfterViewInit() {
    this.initializeCarousel();
  }

  initializeCarousel() {
    const playIcon = document.querySelector('.play-icon-wrapper') as any;
    if (document.querySelectorAll('.carousel').length > 0) {
      let carousels = document.querySelectorAll('.carousel');
      carousels.forEach((carousel) => newCarousel(carousel));

      function newCarousel(carousel: any) {
        let carouselChildren = document.querySelector(
          `.carousel[data-carousel="${carousel.dataset.carousel}"]`
        )!.children;
        let speed = carousel.dataset.speed;
        let carouselContent: any =
          document.querySelectorAll(`.carousel-content`)[
            carousel.dataset.carousel - 1
          ];
        const carouselLength = carouselContent.children.length;
        let width = window.innerWidth - 605;
        let count = width;
        let counterIncrement = width;
        // let int = setInterval(timer, speed);

        // initial transform
        carouselContent.style.transform = `translateX(-${width}px)`;
        console.log('Initial ', carouselContent.children);
        console.log('Before ', self.dispalyedMediaType);
        self.dispalyedMediaType = carouselContent.children[1];
        console.log('After ', self.dispalyedMediaType);

        if (self.dispalyedMediaType?.tagName == 'VIDEO') {
          playIcon.style.display = 'flex';
        }

        function timer() {
          if (count >= (counterIncrement - 2) * (carouselLength - 2)) {
            count = 0;
            carouselContent.style.transform = `translateX(-${count}px)`;
          }
          count = count + counterIncrement;
          carouselContent.style.transform = `translateX(-${count}px)`;
        }

        function carouselClick() {
          // left click

          let index = 1;
          carouselChildren[0].addEventListener('click', function () {
            self.stopVideo();
            if (index == 1) {
              return null;
            }
            count = count - width;
            carouselContent.style.transform = `translateX(-${count - 100}px)`;
            index -= 1;

            if (count < counterIncrement) {
              count = counterIncrement * (carouselLength - 2);
              carouselContent.style.transform = `translateX(-${count - 100}px)`;
            }
            if (carouselContent.children.length - 1 == index) {
              index = 1;
            }
            self.dispalyedMediaType = carouselContent.children[index];
            if (self.dispalyedMediaType?.tagName == 'VIDEO') {
              playIcon.style.display = 'flex';
            } else {
              playIcon.style.display = 'none';
            }

            return null;
          });
          // right click
          carouselChildren[1].addEventListener('click', function () {
            self.stopVideo();
            count = count + width;
            carouselContent.style.transform = `translateX(-${count + 100}px)`;
            index += 1;

            if (count >= counterIncrement * (carouselLength - 1)) {
              count = counterIncrement;
              carouselContent.style.transform = `translateX(-${count + 100}px)`;
            }
            if (carouselContent.children.length - 1 == index) {
              index = 1;
            }
            self.dispalyedMediaType = carouselContent.children[index];
            console.log('Active media ', self.dispalyedMediaType);
            if (self.dispalyedMediaType?.tagName == 'VIDEO') {
              playIcon.style.display = 'flex';
            } else {
              playIcon.style.display = 'none';
            }
          });
        }

        function carouselHoverEffect() {
          // left hover effect events
          carouselChildren[0].addEventListener('mouseenter', function () {
            carouselContent.style.transform = `translateX(-${count - 100}px)`;
            // clearInterval(int);
          });
          carouselChildren[0].addEventListener('mouseleave', function () {
            carouselContent.style.transform = `translateX(-${count}px)`;
            // int = setInterval(timer, speed);
          });

          // right hover effect events
          carouselChildren[1].addEventListener('mouseenter', function () {
            carouselContent.style.transform = `translateX(-${count + 100}px)`;
            // clearInterval(int);
          });
          carouselChildren[1].addEventListener('mouseleave', function () {
            carouselContent.style.transform = `translateX(-${count}px)`;
            // int = setInterval(timer, speed);
          });
        }

        carouselHoverEffect();
        carouselClick();
      }
    }
  }

  removeSkeleton(id: string) {
    let els = document.querySelectorAll(`.${id}`) as any;
    els.forEach((el: any) => {
      el.classList.remove('skeleton-box');
    });
  }

  ngOnDestroy(): void {
    this.routes$?.unsubscribe();
  }
}
