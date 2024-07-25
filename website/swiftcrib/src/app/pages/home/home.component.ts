import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
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
import { AuthService } from '../../services/auth.service';
import { SearchWidgetComponent } from '../../components/search-widget/search-widget.component';

@Component({
  selector: 'app-home',
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
    SearchWidgetComponent
  ],
  providers: [AuthService, ListingService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  public selectedVideo: string = '';
  public videos: string[] = [
    '/assets/videos/sweet-home.mp4',
    '/assets/videos/sweet-home-2.mp4',
  ];
  public nearbyListings: any[] = [];
  public otherListings: any[] = [];
  public serverUrl: string = environment.api;
  public page = 1;
  public pageSize = 10;
  public loading = false;
  public totalPages = 0;
  public searchText: string = '';
  private scrollSubscription: Subscription | undefined;
  bookMarks: any[] = [];
  user: any;
  userSearched: boolean = false;

  constructor(
    public listingService: ListingService,
    public element: ElementRef,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.listingService
      .fetchProximityListings()
      .pipe(take(1))
      .subscribe((response: any) => {
        if (response.status) {
          this.nearbyListings = response.data;
        }
      });

    this.fetchListings();
    this.setupScrollEventListener();
    try {
      this.bookMarks =
        JSON.parse(localStorage.getItem('swiftcrib-bookmark') as string) || [];
    } catch {
      this.bookMarks = [];
    }
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  fetchListings() {
    this.loading = true;
    this.listingService
      .fetchOtherListings(this.page, this.pageSize)
      .pipe(take(1))
      .subscribe((response: any) => {
        if (response.status) {
          this.otherListings.push(...response.data);
          this.totalPages = response.totalPages;
          this.loading = false;
          this.page++;
        }
      });
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
          this.fetchListings();
        }
      });
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
    return this.bookMarks?.some(
      (property: any) => property?._id === propertyId
    );
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
