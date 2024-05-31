interface ListingsConstants {
  DWELLING_TYPES: string[];
  OCCUPANCY_STATUS: string[];
  PROPERTY_MANAGEMENT: string[];
  PROPERTY_OWNERSHIP: string[];
  PROPERTY_CONDITION: string[];
  APPROVAL_STATUS: string[];
  [key: string]: string[];
}

const listingsConstants: ListingsConstants = {
  DWELLING_TYPES: [
    "Single Dwelling",
    "Multiple Dwelling"
  ],
  OCCUPANCY_STATUS: ["Vacant", "Partially Filled", "Filled", "Other Arrangement"],
  PROPERTY_MANAGEMENT: ["External", "Swiftcrib"],
  PROPERTY_OWNERSHIP: ["Individual", "Corporate", "Swiftcrib"],
  PROPERTY_CONDITION: [
    "Excellent",
    "New",
    "Well Maintained",
    "Significant Repairs",
  ],
  APPROVAL_STATUS: ["PENDING", "VERIFIED", "APPROVED", "SUSPENDED"],
  LISTING_CATEGORIES: ["ROYAL","EXECUTIVE","MIDDLE CLASS","LOWER CLASS","COUNTRY HARD"]
};

const constants = {
  listingsConstants
};

export default constants;
