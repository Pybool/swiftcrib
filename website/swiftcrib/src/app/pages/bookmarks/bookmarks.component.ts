import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { SwiftcribHeaderComponent } from '../../components/swiftcrib-header/swiftcrib-header.component';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapComponent } from '../../components/map/map.component';
import { SwiftcribCarouselComponent } from '../../components/swiftcrib-carousel/swiftcrib-carousel.component';
import { SwiftcribFooterComponent } from '../../components/swiftcrib-footer/swiftcrib-footer.component';
import { ListingService } from '../../services/listing.service';
import { take } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bookmarks',
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
  ],
  providers: [AuthService, ListingService],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss',
})
export class BookmarksComponent {
  public propertiesInDefault = 'Ibadan';
  public selectedVideo: string = '';
  public videos: string[] = [
    '/assets/videos/sweet-home.mp4',
    '/assets/videos/sweet-home-2.mp4',
  ];
  public properties: any[] = [];
  public serverUrl: string = environment.api;
  public page = 1;
  public pageSize = 10;
  public loading = false;
  public totalPages = 0;
  public searchText: string = '';
  private scrollSubscription: Subscription | undefined;
  bookMarks: any[] = [];
  user: any;

  constructor(
    public listingService: ListingService,
    public element: ElementRef,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.retrieveUser();
    window.scrollTo(0, 0);

    this.setupScrollEventListener();
    if (!this.user) {
      try {
        this.bookMarks = JSON.parse(localStorage.getItem('swiftcrib-bookmark') as string) || [];
      } catch {
        this.bookMarks = [];
      }
    }
    this.fetchBookmarks();
    console.log('Bookmarks ', this.bookMarks);
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  fetchBookmarks() {
    this.loading = true;
    if (this.user) {
      this.listingService
        .fetchBookMarks(this.page, this.pageSize)
        .pipe(take(1))
        .subscribe(
          (response: any) => {
            if (response.status) {
              this.properties.push(...response.data);
              this.totalPages = response.totalPages;
              this.loading = false;
              this.page++;
            }
          },
          (error: any) => {
            this.loading = false;
          }
        );
    } else {
      this.properties = this.bookMarks;
      this.loading = false;
      console.log('Properties ', this.properties);
    }
  }

  setupScrollEventListener() {
    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(
        debounceTime(200),
        filter(() => {
          const scrollPosition = window.pageYOffset + window.innerHeight;
          const maxScroll = document.documentElement.scrollHeight;
          const threshold = window.innerHeight * 3; // 20vh
          return !this.loading && maxScroll - scrollPosition < threshold;
        })
      )
      .subscribe(() => {
        if (this.page <= this.totalPages) {
          this.fetchBookmarks();
        }
      });
  }

  localBookMark(listing: any) {
    if (!this.user) {
      localStorage.removeItem('swiftcrib-bookmark');
    }
    const listingId = listing._id;
    if (this.isBookMarked(listingId)) {
      this.properties = this.properties.filter(
        (property: any) => property._id !== listingId
      );

      this.bookMarks = this.bookMarks.filter(
        (property: any) => property._id !== listingId
      );
    }

    if (this.user) {
      console.log('Saving to backend');
      this.listingService
        .bookMarkListing(listingId)
        .pipe(take(1))
        .subscribe(
          (response: any) => {
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
    return this.properties?.some(
      (property: any) => property._id === propertyId
    );
  }

  searchForApartments() {
    console.log('Searching for ', this.searchText);
  }

  getProperty($event: any, slug: string) {
    const classList = Array.from($event.target.classList);
    if (
      classList.includes('no-prop') == false
    ) {
      this.router.navigateByUrl(`/property/${slug}`);
    }
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }
}
