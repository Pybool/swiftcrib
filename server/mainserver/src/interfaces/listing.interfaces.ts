export interface IPropertyListing {
  propertyOwnerNoAuth: string;
  dwellingType: string;
  occupancyStatus: string;
  listingCategory: string;
  listingMedia?: IMediaItem[];
  propertyCondition: string;
  listingTags?: string[];
  description: string;
  propertySize: string;
  propertyOverview: string;
  approvalStatus: string;
  listedBy: string;
  address: string;
  slug?: string;
  approvedBy?: string;
  createdAt?: Date;
}

export interface IPropertyListingOptional {
  propertyOwnerNoAuth?: string;
  dwellingType?: string;
  occupancyStatus?: string;
  listingCategory?: string;
  propertyCondition?: string;
  listingTags?: string[];
  description?: string;
  propertySize?: string;
  propertyOverview?: string;
  approvalStatus?: string;
  listedBy?: string;
  address?: string;
  slug?: string;
  updatedAt: Date;
}

export interface IHabitationRules {
  listing?: string;
  rules: string[];
}

export interface IListingAmenities {
  listing?: string;
  amenities: string[];
}

export interface IMediaItem {
  type: string;
  url: string;
}

export interface IListingFilters {
  searchText?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  beds?: string | number;
  baths?: string | number;
  serviceType?: string;
  page?:string | number;
  limit?:string | number;
  loc?: string;
}

export interface IListingEnquiry{
  account?: string;
  name?: string;
  email?: string;
  phone?: string;
  message: string;
  url:string;
  createdAt?: Date;
}
