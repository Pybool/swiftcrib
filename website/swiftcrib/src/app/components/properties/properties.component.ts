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
import { AuthService } from '../../services/auth.service';
import { SearchWidgetComponent } from '../search-widget/search-widget.component';

interface Ifilters {
  searchText?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  beds?: number | string;
  baths?: number | string;
  serviceType?: string;
}

@Component({
  selector: 'app-properties',
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
    SearchWidgetComponent,
  ],
  providers: [AuthService, ListingService],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
})
export class PropertiesComponent {
  public serviceType = 'Ibadan';
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
  public bookMarks: any[] = [];
  public user: any;
  public userSearched: boolean = false;
  public redirect: boolean = false;
  public filters: Ifilters = {};
  public defaultLocation = 'ibadan';
  public routes$: any;
  public routesQp$: any;

  constructor(
    public listingService: ListingService,
    public element: ElementRef,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.retrieveUser();
    this.routes$ = this.route.params.subscribe((params) => {
      this.serviceType = params['serviceType'] || 'rental';
      this.defaultLocation = params['location'];
      if (this.serviceType) {
        this.filters.serviceType = this.serviceType;
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
      .searchListings(
        this.page,
        this.pageSize,
        this.filters,
        this.defaultLocation
      )
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          if (response?.status) {
            this.properties.push(...response.data);
            this.totalPages = response.totalPages;
            this.loading = false;
            this.page++;
            if (this.userSearched && this.properties.length > 0) {
              this.userSearched = false;
            }
          } else {
            this.loading = false;
          }
          this.changeLocation(this.filters);
        },
        (error: any) => {
          this.loading = false;
        }
      );
  }

  setupScrollEventListener() {
    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(
        debounceTime(200),
        filter(() => {
          const scrollPosition = window.pageYOffset + window.innerHeight;
          const maxScroll = document.documentElement.scrollHeight;
          const threshold = window.innerHeight * 3;
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

  changeLocation(filter: any) {
    const queryParams: any = {}; // Object to hold query parameters

    if (filter.searchText) {
      queryParams.searchText = filter.searchText;
    }

    if (filter.minPrice !== undefined && !isNaN(filter.minPrice)) {
      queryParams.minPrice = filter.minPrice;
    }

    if (filter.maxPrice !== undefined && !isNaN(filter.maxPrice)) {
      queryParams.maxPrice = filter.maxPrice;
    }

    if (filter.beds !== undefined && !isNaN(filter.beds)) {
      queryParams.beds = filter.beds;
    }

    if (filter.baths !== undefined && !isNaN(filter.baths)) {
      queryParams.baths = filter.baths;
    }

    if (filter.serviceType) {
      queryParams.serviceType = filter.serviceType;
    }

    // Navigate to the route with query parameters
    this.router.navigate([`/properties/rentals/${this.defaultLocation}`], {
      queryParams,
    });
  }

  setFilters(filter: any) {
    console.log('Filters ', filter);
    this.filters = this.cleanParams(filter);
    console.log('Cleaned 2 Filter params ', this.filters);
    this.filters.serviceType = this.serviceType;
    this.searchText = this.filters.searchText!;
    this.searchForApartments();
  }

  searchForApartments() {
    this.userSearched = true;
    this.page = 1;
    this.properties = [];
    this.fetchListings();
  }

  cleanParams(params: any) {
    let val: any = '';
    let newparams = JSON.parse(JSON.stringify(params));

    try {
      val = newparams['searchText'] || '';
      newparams.searchText = val;
    } catch {
      newparams.searchText = '';
    }

    try {
      val = newparams['minPrice'];
      console.log('Minval ', val, isNaN(val));
      if (isNaN(val)) {
        val = '';
      }
      newparams.minPrice = val;
      console.log('Minval ', val, isNaN(val));
    } catch {
      newparams.minPrice = '';
    }

    try {
      val = newparams['maxPrice'];
      if (isNaN(val)) {
        val = '';
      }
      newparams.maxPrice = val;
    } catch {
      newparams.maxPrice = '';
    }

    try {
      val = newparams['beds'] || '';
      if (isNaN(val)) {
        val = '';
      }
      newparams.beds = val;
    } catch {
      newparams.beds = '';
    }

    try {
      val = newparams['baths'] || '';
      if (isNaN(val)) {
        val = '';
      }
      newparams.baths = val;
    } catch {
      newparams.baths = '';
    }

    console.log('New Paramsxx ', newparams);

    return newparams;
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
    this.routesQp$?.unsubscribe();
    this.routes$?.unsubscribe();
  }
}
