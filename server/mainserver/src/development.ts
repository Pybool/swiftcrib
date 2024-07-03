const axios = require("axios");
const fs = require("fs");
import FormData from "form-data";
import Listing from "./models/Listings/listings.property.model";
import { delay } from "./helpers/misc";
const path = require("path");

const listings: any = [
  {
    propertyOwnerNoAuth: "John Maxwell",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["pool", "garage", "garden"],
    description:
      "A newly built multiple dwelling property located in a serene neighborhood. It features modern amenities and spacious rooms, perfect for a family looking for comfort and convenience.",
    propertySize: "3500 sq ft",
    propertyOverview:
      "This property includes 4 bedrooms, 3 bathrooms, a modern kitchen, a large living room, and a backyard with a swimming pool. It's located near schools, shopping centers, and public transportation.",
    approvalStatus: "PENDING",
    address: "Road 4 Adron Estate, Ayegun-Oleyo, Ibadan Oyo",
    lga: "Ibadan South West",
    state: "Oyo",
    street: "Road 4 Adron Estate",
  },
  {
    propertyOwnerNoAuth: "Jane Smith",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "Good",
    listingTags: ["garage", "garden"],
    description:
      "A well-maintained single family home with a spacious garden and garage, ideal for a family looking for a comfortable living space.",
    propertySize: "3000 sq ft",
    propertyOverview:
      "3 bedrooms, 2 bathrooms, modern kitchen, large living room, garage, and garden. Located close to schools and parks.",
    approvalStatus: "PENDING",
    address: "12 Oluyole Estate, Ibadan Oyo",
    lga: "Ibadan North West",
    state: "Oyo",
    street: "Oluyole Estate",
  },
  {
    propertyOwnerNoAuth: "Robert Brown",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["balcony", "gym"],
    description:
      "A modern apartment with state-of-the-art facilities, perfect for individuals or small families looking for a convenient living space.",
    propertySize: "1200 sq ft",
    propertyOverview:
      "2 bedrooms, 2 bathrooms, modern kitchen, living room, balcony, and access to a gym. Located close to public transportation and shopping centers.",
    approvalStatus: "PENDING",
    address: "10 Bodija, Ibadan Oyo",
    lga: "Ibadan North",
    state: "Oyo",
    street: "Bodija",
  },
  {
    propertyOwnerNoAuth: "Alice Johnson",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "UPPER MIDDLE CLASS",
    propertyCondition: "Excellent",
    listingTags: ["garage", "garden"],
    description:
      "A newly constructed duplex with a spacious garden and modern amenities, located in a prestigious neighborhood.",
    propertySize: "3200 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, large living room, garage, and garden. Close to schools and shopping centers.",
    approvalStatus: "PENDING",
    address: "18 Ikolaba Estate, Ibadan Oyo",
    lga: "Ibadan North East",
    state: "Oyo",
    street: "Ikolaba Estate",
  },
  {
    propertyOwnerNoAuth: "Michael Davis",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "Excellent",
    listingTags: ["garage", "balcony"],
    description:
      "An excellent townhouse in a prime location. Modern amenities and spacious living areas.",
    propertySize: "2700 sq ft",
    propertyOverview:
      "3 bedrooms, 2 bathrooms, modern kitchen, living room, garage, and balcony. Close to shopping and entertainment centers.",
    approvalStatus: "PENDING",
    address: "18 Onireke, Ibadan Oyo",
    lga: "Ibadan North West",
    state: "Oyo",
    street: "Onireke",
  },
  {
    propertyOwnerNoAuth: "Lucas Nelson",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["balcony", "gym"],
    description:
      "A newly built apartment with modern amenities and a convenient location.",
    propertySize: "1500 sq ft",
    propertyOverview:
      "2 bedrooms, 2 bathrooms, modern kitchen, living room, balcony, and access to a gym. Close to public transport.",
    approvalStatus: "PENDING",
    address: "25 Ring Road, Ibadan Oyo",
    lga: "Ibadan South West",
    state: "Oyo",
    street: "Ring Road",
  },
  {
    propertyOwnerNoAuth: "Harper Scott",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "Good",
    listingTags: ["balcony", "garage"],
    description:
      "A charming single family home with a large balcony and garage.",
    propertySize: "2900 sq ft",
    propertyOverview:
      "3 bedrooms, 2 bathrooms, modern kitchen, living room, balcony, and garage. Near schools and parks.",
    approvalStatus: "PENDING",
    address: "28 Bashorun, Ibadan Oyo",
    lga: "Ibadan North",
    state: "Oyo",
    street: "Bashorun",
  },
  {
    propertyOwnerNoAuth: "Ella Green",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "UPPER MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["garage", "garden"],
    description:
      "A newly built duplex with modern amenities and a large garden.",
    propertySize: "3500 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, living room, garage, and garden. Close to schools and shopping centers.",
    approvalStatus: "PENDING",
    address: "33 Challenge, Ibadan Oyo",
    lga: "Ibadan South East",
    state: "Oyo",
    street: "Challenge",
  },
  {
    propertyOwnerNoAuth: "Mason Baker",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["balcony", "gym"],
    description:
      "A newly built apartment with modern amenities and a convenient location.",
    propertySize: "1600 sq ft",
    propertyOverview:
      "2 bedrooms, 2 bathrooms, modern kitchen, living room, balcony, and access to a gym. Close to public transport.",
    approvalStatus: "PENDING",
    address: "27 Eleyele, Ibadan Oyo",
    lga: "Ibadan North West",
    state: "Oyo",
    street: "Eleyele",
  },
  {
    propertyOwnerNoAuth: "Aiden Rivera",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "Good",
    listingTags: ["garage", "garden"],
    description:
      "A beautiful single family home with a large garden and garage.",
    propertySize: "3100 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, living room, garage, and garden. Close to schools and shopping centers.",
    approvalStatus: "PENDING",
    address: "15 Agodi GRA, Ibadan Oyo",
    lga: "Ibadan North East",
    state: "Oyo",
    street: "Agodi GRA",
  },
  {
    propertyOwnerNoAuth: "Mila Hall",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "UPPER MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["garage", "garden"],
    description:
      "A newly built duplex with modern amenities and a large garden.",
    propertySize: "3300 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, living room, garage, and garden. Close to schools and shopping centers.",
    approvalStatus: "PENDING",
    address: "10 Alalubosa Estate, Ibadan Oyo",
    lga: "Ibadan South West",
    state: "Oyo",
    street: "Alalubosa Estate",
  },
  {
    propertyOwnerNoAuth: "Henry Clark",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["balcony", "gym"],
    description:
      "A newly built apartment with modern amenities and a convenient location.",
    propertySize: "1600 sq ft",
    propertyOverview:
      "2 bedrooms, 2 bathrooms, modern kitchen, living room, balcony, and access to a gym. Close to public transport.",
    approvalStatus: "PENDING",
    address: "11 Ring Road, Ibadan Oyo",
    lga: "Ibadan South West",
    state: "Oyo",
    street: "Ring Road",
  },
  {
    propertyOwnerNoAuth: "Emma Thomas",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "UPPER MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["garage", "garden"],
    description:
      "A newly built duplex with modern amenities and a large garden.",
    propertySize: "3100 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, living room, garage, and garden. Close to schools and shopping centers.",
    approvalStatus: "PENDING",
    address: "29 Awolowo Avenue, Ibadan Oyo",
    lga: "Ibadan North",
    state: "Oyo",
    street: "Awolowo Avenue",
  },
  {
    propertyOwnerNoAuth: "Sophia Hernandez",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "HIGH CLASS",
    propertyCondition: "Excellent",
    listingTags: ["pool", "gym"],
    description:
      "A luxurious multiple dwelling property with top-notch amenities and a prime location.",
    propertySize: "5000 sq ft",
    propertyOverview:
      "6 bedrooms, 5 bathrooms, modern kitchen, large living room, pool, and gym. Located in a prestigious neighborhood.",
    approvalStatus: "PENDING",
    address: "43 Ikolaba Estate, Ibadan Oyo",
    lga: "Ibadan North East",
    state: "Oyo",
    street: "Ikolaba Estate",
  },
  {
    propertyOwnerNoAuth: "Zoe Harris",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "UPPER MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["garage", "garden"],
    description:
      "A newly built duplex with modern amenities and a large garden.",
    propertySize: "3300 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, living room, garage, and garden. Close to schools and shopping centers.",
    approvalStatus: "PENDING",
    address: "41 Challenge, Ibadan Oyo",
    lga: "Ibadan South East",
    state: "Oyo",
    street: "Challenge",
  },
  {
    propertyOwnerNoAuth: "Olivia Jones",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["balcony", "gym"],
    description:
      "A newly built apartment with modern amenities and a convenient location.",
    propertySize: "1200 sq ft",
    propertyOverview:
      "2 bedrooms, 2 bathrooms, modern kitchen, living room, balcony, and access to a gym. Close to public transport.",
    approvalStatus: "PENDING",
    address: "13 Challenge Road, Ibadan Oyo",
    lga: "Ibadan South East",
    state: "Oyo",
    street: "Challenge Road",
  },
  {
    propertyOwnerNoAuth: "Lucas Robinson",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "Good",
    listingTags: ["garage", "garden"],
    description:
      "A beautiful single family home with a large garden and garage.",
    propertySize: "3200 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, living room, garage, and garden. Close to schools and shopping centers.",
    approvalStatus: "PENDING",
    address: "36 New Bodija, Ibadan Oyo",
    lga: "Ibadan North",
    state: "Oyo",
    street: "New Bodija",
  },
  {
    propertyOwnerNoAuth: "Ethan Wilson",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "HIGH CLASS",
    propertyCondition: "Excellent",
    listingTags: ["pool", "gym"],
    description:
      "A luxurious multiple dwelling property with top-notch amenities and a prime location.",
    propertySize: "5000 sq ft",
    propertyOverview:
      "6 bedrooms, 5 bathrooms, modern kitchen, large living room, pool, and gym. Located in a prestigious neighborhood.",
    approvalStatus: "PENDING",
    address: "40 Ikolaba Estate, Ibadan Oyo",
    lga: "Ibadan North East",
    state: "Oyo",
    street: "Ikolaba Estate",
  },
  {
    propertyOwnerNoAuth: "Mila Perez",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "Excellent",
    listingTags: ["garage", "balcony"],
    description:
      "An excellent townhouse in a prime location. Modern amenities and spacious living areas.",
    propertySize: "2500 sq ft",
    propertyOverview:
      "3 bedrooms, 2 bathrooms, modern kitchen, living room, garage, and balcony. Close to shopping and entertainment centers.",
    approvalStatus: "PENDING",
    address: "42 Oluyole Estate, Ibadan Oyo",
    lga: "Ibadan North West",
    state: "Oyo",
    street: "Oluyole Estate",
  },
  {
    propertyOwnerNoAuth: "Amelia Hall",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "UPPER MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["garage", "garden"],
    description:
      "A newly built duplex with modern amenities and a large garden.",
    propertySize: "3100 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, living room, garage, and garden. Close to schools and shopping centers.",
    approvalStatus: "PENDING",
    address: "29 Awolowo Avenue, Ibadan Oyo",
    lga: "Ibadan North",
    state: "Oyo",
    street: "Awolowo Avenue",
  },
  {
    propertyOwnerNoAuth: "James Brown",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "UPPER MIDDLE CLASS",
    propertyCondition: "Good",
    listingTags: ["balcony", "garage"],
    description:
      "A beautiful single family home with a large balcony and garage.",
    propertySize: "3500 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, living room, balcony, and garage. Close to schools and parks.",
    approvalStatus: "PENDING",
    address: "15 Ring Road, Ibadan Oyo",
    lga: "Ibadan South West",
    state: "Oyo",
    street: "Ring Road",
  },
  {
    propertyOwnerNoAuth: "Aiden Taylor",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["balcony", "gym"],
    description:
      "A newly built apartment with modern amenities and a convenient location.",
    propertySize: "1600 sq ft",
    propertyOverview:
      "2 bedrooms, 2 bathrooms, modern kitchen, living room, balcony, and access to a gym. Close to public transport.",
    approvalStatus: "PENDING",
    address: "31 Challenge Road, Ibadan Oyo",
    lga: "Ibadan South East",
    state: "Oyo",
    street: "Challenge Road",
  },
  {
    propertyOwnerNoAuth: "Mia White",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "UPPER MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["garage", "garden"],
    description:
      "A newly built duplex with modern amenities and a large garden.",
    propertySize: "3200 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, living room, garage, and garden. Close to schools and shopping centers.",
    approvalStatus: "PENDING",
    address: "20 Bashorun, Ibadan Oyo",
    lga: "Ibadan North",
    state: "Oyo",
    street: "Bashorun",
  },
  {
    propertyOwnerNoAuth: "Olivia Martinez",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["balcony", "gym"],
    description:
      "A newly built apartment with modern amenities and a convenient location.",
    propertySize: "1400 sq ft",
    propertyOverview:
      "2 bedrooms, 2 bathrooms, modern kitchen, living room, balcony, and access to a gym. Close to public transport.",
    approvalStatus: "PENDING",
    address: "15 Challenge Road, Ibadan Oyo",
    lga: "Ibadan South East",
    state: "Oyo",
    street: "Challenge Road",
  },
  {
    propertyOwnerNoAuth: "Lucas King",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "Good",
    listingTags: ["garage", "garden"],
    description:
      "A beautiful single family home with a large garden and garage.",
    propertySize: "3100 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, living room, garage, and garden. Close to schools and shopping centers.",
    approvalStatus: "PENDING",
    address: "25 New Bodija, Ibadan Oyo",
    lga: "Ibadan North",
    state: "Oyo",
    street: "New Bodija",
  },
  {
    propertyOwnerNoAuth: "Henry Lewis",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "HIGH CLASS",
    propertyCondition: "Excellent",
    listingTags: ["pool", "gym"],
    description:
      "A luxurious multiple dwelling property with top-notch amenities and a prime location.",
    propertySize: "5000 sq ft",
    propertyOverview:
      "6 bedrooms, 5 bathrooms, modern kitchen, large living room, pool, and gym. Located in a prestigious neighborhood.",
    approvalStatus: "PENDING",
    address: "40 Ikolaba Estate, Ibadan Oyo",
    lga: "Ibadan North East",
    state: "Oyo",
    street: "Ikolaba Estate",
  },
  {
    propertyOwnerNoAuth: "Emma Clark",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["balcony", "gym"],
    description:
      "A newly built apartment with modern amenities and a convenient location.",
    propertySize: "1500 sq ft",
    propertyOverview:
      "2 bedrooms, 2 bathrooms, modern kitchen, living room, balcony, and access to a gym. Close to public transport.",
    approvalStatus: "PENDING",
    address: "20 Ring Road, Ibadan Oyo",
    lga: "Ibadan South West",
    state: "Oyo",
    street: "Ring Road",
  },
  {
    propertyOwnerNoAuth: "Amelia Brown",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "UPPER MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["garage", "garden"],
    description:
      "A newly built duplex with modern amenities and a large garden.",
    propertySize: "3300 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, living room, garage, and garden. Close to schools and shopping centers.",
    approvalStatus: "PENDING",
    address: "22 Challenge Road, Ibadan Oyo",
    lga: "Ibadan South East",
    state: "Oyo",
    street: "Challenge Road",
  },
  {
    propertyOwnerNoAuth: "James Harris",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "Good",
    listingTags: ["balcony", "garage"],
    description:
      "A beautiful single family home with a large balcony and garage.",
    propertySize: "3500 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, living room, balcony, and garage. Close to schools and parks.",
    approvalStatus: "PENDING",
    address: "18 Ring Road, Ibadan Oyo",
    lga: "Ibadan South West",
    state: "Oyo",
    street: "Ring Road",
  },
  {
    propertyOwnerNoAuth: "Liam Nelson",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["balcony", "gym"],
    description:
      "A newly built apartment with modern amenities and a convenient location.",
    propertySize: "1600 sq ft",
    propertyOverview:
      "2 bedrooms, 2 bathrooms, modern kitchen, living room, balcony, and access to a gym. Close to public transport.",
    approvalStatus: "PENDING",
    address: "24 Challenge Road, Ibadan Oyo",
    lga: "Ibadan South East",
    state: "Oyo",
    street: "Challenge Road",
  },
  {
    propertyOwnerNoAuth: "Mila Martinez",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "UPPER MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["garage", "garden"],
    description:
      "A newly built duplex with modern amenities and a large garden.",
    propertySize: "3100 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, living room, garage, and garden. Close to schools and shopping centers.",
    approvalStatus: "PENDING",
    address: "29 Bashorun, Ibadan Oyo",
    lga: "Ibadan North",
    state: "Oyo",
    street: "Bashorun",
  },
  {
    propertyOwnerNoAuth: "Emma Thomas",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "HIGH CLASS",
    propertyCondition: "Excellent",
    listingTags: ["pool", "gym"],
    description:
      "A luxurious multiple dwelling property with top-notch amenities and a prime location.",
    propertySize: "5000 sq ft",
    propertyOverview:
      "6 bedrooms, 5 bathrooms, modern kitchen, large living room, pool, and gym. Located in a prestigious neighborhood.",
    approvalStatus: "PENDING",
    address: "37 Ikolaba Estate, Ibadan Oyo",
    lga: "Ibadan North East",
    state: "Oyo",
    street: "Ikolaba Estate",
  },
  {
    propertyOwnerNoAuth: "Henry Wilson",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["balcony", "gym"],
    description:
      "A newly built apartment with modern amenities and a convenient location.",
    propertySize: "1500 sq ft",
    propertyOverview:
      "2 bedrooms, 2 bathrooms, modern kitchen, living room, balcony, and access to a gym. Close to public transport.",
    approvalStatus: "PENDING",
    address: "14 Ring Road, Ibadan Oyo",
    lga: "Ibadan South West",
    state: "Oyo",
    street: "Ring Road",
  },
  {
    propertyOwnerNoAuth: "Olivia Harris",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "Good",
    listingTags: ["garage", "garden"],
    description:
      "A beautiful single family home with a large garden and garage.",
    propertySize: "3200 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, living room, garage, and garden. Close to schools and shopping centers.",
    approvalStatus: "PENDING",
    address: "30 New Bodija, Ibadan Oyo",
    lga: "Ibadan North",
    state: "Oyo",
    street: "New Bodija",
  },
  {
    propertyOwnerNoAuth: "James Wilson",
    dwellingType: "Single Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "UPPER MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["garage", "garden"],
    description:
      "A newly built duplex with modern amenities and a large garden.",
    propertySize: "3300 sq ft",
    propertyOverview:
      "4 bedrooms, 3 bathrooms, modern kitchen, living room, garage, and garden. Close to schools and shopping centers.",
    approvalStatus: "PENDING",
    address: "25 Bashorun, Ibadan Oyo",
    lga: "Ibadan North",
    state: "Oyo",
    street: "Bashorun",
  },
  {
    propertyOwnerNoAuth: "Mia Hernandez",
    dwellingType: "Multiple Dwelling",
    occupancyStatus: "Vacant",
    listingCategory: "MIDDLE CLASS",
    propertyCondition: "New",
    listingTags: ["balcony", "gym"],
    description:
      "A newly built apartment with modern amenities and a convenient location.",
    propertySize: "1400 sq ft",
    propertyOverview:
      "2 bedrooms, 2 bathrooms, modern kitchen, living room, balcony, and access to a gym. Close to public transport.",
    approvalStatus: "PENDING",
    address: "17 Challenge Road, Ibadan Oyo",
    lga: "Ibadan South East",
    state: "Oyo",
    street: "Challenge Road",
  },
];

function getImagesInFolder(folderPath: string) {
  try {
    const files = fs.readdirSync(folderPath);

    // Filter only image files (you can adjust the extensions as needed)
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const imageFiles = files.filter((file: any) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    // Map filenames to full paths
    const imagePaths = imageFiles.map((file: any) =>
      path.join(folderPath, file)
    );

    return imagePaths;
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
}

function getStartStopIndexes(index: any) {
  const startIndex = index * 2;
  const stopIndex = startIndex + 1;
  return { startIndex, stopIndex };
}

function getImages(index: any) {
  try {
    const folderPath = "C:\\Users\\emmanuel\\Downloads\\homes"; // Replace with your folder path
    const images = getImagesInFolder(folderPath);
    const { startIndex, stopIndex } = getStartStopIndexes(index);
    if (startIndex < images.length && stopIndex < images.length) {
      return [images[startIndex], images[stopIndex]];
    } else {
      console.error("Invalid index or insufficient array length.");
    }
  } catch (error) {
    console.log(error);
  }
}

async function createListing(json: any, imagePaths: any) {
  const form: any = new FormData();
  form.append("data", JSON.stringify(json));

  imagePaths.forEach((imagePath: any, index: any) => {
    form.append(
      "attachments",
      fs.createReadStream(imagePath),
      `image${index}.jpg`
    );
  });

  try {
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTk2OTM5MDUsImV4cCI6MTcyNTY5MzkwNSwiYXVkIjoiNjY1Y2QwMmM1ZDYwMmY1YmI0YjcxNmE1IiwiaXNzIjoic3dpZnRjcmliLmNvbSJ9.mCH_bu4cJolYuTjohFOLly5w_AsU0y5OMsBC1ViMlyc`;
    const response = await axios.post(
      "http://localhost:8200/api/v1/listing/create-listing",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading images:", error);
  }
}

function generateRandomRentPrice() {
  const min = 400000;
  const max = 1000000;
  const randomPrice = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomPrice;
}


const addPriceBedAndBaths = async () => {
  const listings = await Listing.find({});
  for (let listing of listings) {
    const bedsBaths = listing.propertyOverview.replace("This property includes ","").split("bathrooms")[0].trim().split("bedrooms,");
    listing.fullPrice = generateRandomRentPrice();
    listing.beds = parseInt(bedsBaths[0].trim())
    listing.baths = parseInt(bedsBaths[1].trim())
    await listing.save()
  }
};

const devCreateListings = async () => {
  let index = 0;
  for (let listing of listings) {
    await delay(2000)
    console.log(`${index}: Uploading for ${listing.propertyOwnerNoAuth}`);
    await createListing(listing, getImages(index));
    index += 1;
    
  }
  addPriceBedAndBaths()
  return {message: "Completed"};
};


const development = { devCreateListings, addPriceBedAndBaths }

export default development
