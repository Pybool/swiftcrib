export interface IPropertySpace {
  listing: string;
  name: string;
  description: string;
  condition: string;
  spaceSize: string;
  slug?: string;
  status?: string;
  spaceMedia?: IMediaItem[];
  listedBy?: string;
  createdAt?: Date;
}

export interface IPropertySpaceOptional{
  listing?: string;
  name?: string;
  description?: string;
  condition?: string;
  spaceSize?: string;
  slug?: string;
  status?: string;
  listedBy?: string;
  updatedAt: Date;
}

export interface ISpaceAmenities{
  space?: string;
  amenities: string[];
}

export interface IMediaItem {
  type: string;
  url: string;
}
