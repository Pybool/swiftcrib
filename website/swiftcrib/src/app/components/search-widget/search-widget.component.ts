import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-widget',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMapsModule,
    MapComponent,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './search-widget.component.html',
  styleUrl: './search-widget.component.scss',
})
export class SearchWidgetComponent implements OnDestroy {
  priceWarn: boolean = false;
  @Input() redirect: boolean = true;
  @Output() setFilters: EventEmitter<any> = new EventEmitter<any>();
  public filter: any = {
    searchText: '',
    minPrice: 'Select Min-Price',
    maxPrice: 'Select Max-Price',
    bedrooms: 'Select Bedroom Type',
    bathrooms: 'Select Bathroom Type',
  };
  public prices: number[] = [
    50000, 100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000,
    500000, 550000, 600000, 700000, 800000, 900000, 1000000, 1500000, 2000000,
    3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000, 10000000,
  ];

  public bedrooms: string[] = [
    '1 Bedroom',
    '2 Bedroom',
    '3 Bedroom',
    '4 Bedroom',
    '5 Bedroom',
    '6 Bedroom',
    '7 Bedroom',
    '8 Bedroom',
    '9 Bedroom',
    '10 Bedroom',
  ];

  public bathrooms: string[] = [
    '1 Bathroom',
    '2 Bathroom',
    '3 Bathroom',
    '4 Bathroom',
    '5 Bathroom',
    '6 Bathroom',
    '7 Bathroom',
    '8 Bathroom',
    '9 Bathroom',
    '10 Bathroom',
  ];
  public defaultLocation = "ibadan";
  public routes$:any

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(){
    this.routes$ = this.route.queryParams.subscribe((params: any) => {
      if (!params) {
        console.log('Do nothing for now');
      }
      if(params['searchText']){
        this.filter.searchText = params['searchText']
      }
      if(params['minPrice']){
        this.filter.minPrice = params['minPrice']
      }
      if(params['maxPrice']){
        this.filter.maxPrice = params['maxPrice']
      }
      if(params['beds']){
        this.filter.bedrooms = params['beds'] + " " + 'Bedroom'
      }

      if(params['baths']){
        this.filter.bathrooms = params['baths'] + " " + 'Bathroom'
      }

      if(params['loc']){
        this.defaultLocation = params['loc']
      }
            
      console.log('Filter params ', params);
    });
  }

  searchForApartments() {
    if (this.redirect) {
      this.router.navigateByUrl(`/properties/${this.filter.searchText}`);
    } else {
      this.filter.searchText = this.filter.searchText;
      this.filter.beds = this.filter.bedrooms.split(" ")[0]
      this.filter.baths = this.filter.bathrooms.split(" ")[0]
      this.setFilters.emit(this.filter);
    }
  }

  showPriceRangeDropDown(type: string) {
    const dropdown = document.querySelector(
      `.price-range-content-${type}`
    ) as any;
    if (dropdown) {
      dropdown.classList.add('show');
    }
  }

  hidePriceRangeDropDown(type: string) {
    const dropdown = document.querySelector(
      `.price-range-content-${type}`
    ) as any;
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  }

  showBedroomsDropDown() {
    const dropdown = document.querySelector(`.bedroom-dropdown-content`) as any;
    if (dropdown) {
      dropdown.classList.add('show');
    }
  }

  hideBedroomsDropDown() {
    const dropdown = document.querySelector(`.bedroom-dropdown-content`) as any;
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  }

  showBathroomsDropDown() {
    const dropdown = document.querySelector(`.bathroom-dropdown-content`) as any;
    if (dropdown) {
      dropdown.classList.add('show');
    }
  }

  hideBathroomsDropDown() {
    const dropdown = document.querySelector(`.bathroom-dropdown-content`) as any;
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  }

  filterSetters(val: string | number) {
    const validate = () => {
      const minPrice = this.filter.minPrice;
      const maxPrice = this.filter.maxPrice;
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        if (minPrice > maxPrice) {
          alert('Min price cannot be greater than Max price');
          return false;
        }
        this.priceEnableSearchButton();
        return true;
      }
      this.priceEnableSearchButton();
      return true;
    };

    return {
      minPrice: () => {
        const oldVal = this.filter.minPrice;
        this.filter.minPrice = val;
        if (!validate()) {
          this.filter.minPrice = oldVal;
        }
        this.hidePriceRangeDropDown('min');
      },
      maxPrice: () => {
        const oldVal = this.filter.maxPrice;
        this.filter.maxPrice = val;
        if (!validate()) {
          this.filter.maxPrice = oldVal;
        }
        this.hidePriceRangeDropDown('max');
      },
      bedrooms: () => {
        this.filter.bedrooms = val;
        this.hideBedroomsDropDown();
      },
      bathrooms: () => {
        this.filter.bathrooms = val;
        this.hideBathroomsDropDown();
      },
    };
  }

  priceEnableSearchButton() {
    const minPrice = this.filter.minPrice;
    const maxPrice = this.filter.maxPrice;
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        this.priceWarn = false;
        return true;
      }
      this.priceWarn = true;
      return true;
    }
    this.priceWarn = false;
    return null;
  }

  resetFilter() {
    const queryParams = {}
    this.filter = {
      searchText: '',
      minPrice: 'Select Min-Price',
      maxPrice: 'Select Max-Price',
      bedrooms: 'Select Bedroom Type',
      bathrooms: 'Select Bathroom Type',
    };
    this.router.navigate([`/properties/rentals/${this.defaultLocation}`], { queryParams });
  }

  searchDisabled() {
    const conditions = {
      anything: this.filter.searchText?.trim() !== '',
      prices: this.priceEnableSearchButton(),
      bedrooms: this.filter.bedrooms !== 'Select Bedroom Type',
      bathrooms: this.filter.bathrooms !== 'Select Bathroom Type',
    };

    if (
      !conditions.prices &&
      !isNaN(this.filter.minPrice) &&
      !isNaN(this.filter.maxPrice)
    ) {
      return true;
    } else if (
      conditions.anything ||
      conditions.bedrooms ||
      conditions.bathrooms ||
      conditions.prices
    ) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy(){
    this.routes$?.unsubscribe()
  }
}
