import { Constituency } from "./types";

export const PROVINCES = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpaschim Province"
];

// Simplified for demo
export const DISTRICTS: Record<string, string[]> = {
  "Koshi Province": ["Morang", "Sunsari", "Jhapa", "Ilam"],
  "Madhesh Province": ["Saptari", "Siraha", "Dhanusha", "Parsa"],
  "Bagmati Province": ["Kathmandu", "Lalitpur", "Bhaktapur", "Chitwan"],
  "Gandaki Province": ["Kaski", "Gorkha", "Tanahun", "Syangja"],
  "Lumbini Province": ["Rupandehi", "Dang", "Banke", "Palpa"],
  "Karnali Province": ["Surkhet", "Dailekh", "Jumla", "Humla"],
  "Sudurpaschim Province": ["Kailali", "Kanchanpur", "Doti", "Achham"]
};

// Simplified Muncipalities map (District -> Municipalities)
export const MUNICIPALITIES: Record<string, string[]> = {
  "Kathmandu": ["Kathmandu Metropolitan City", "Kirtipur Municipality", "Chandragiri Municipality"],
  "Lalitpur": ["Lalitpur Metropolitan City", "Mahalaxmi Municipality"],
  "Bhaktapur": ["Bhaktapur Municipality", "Madhyapur Thimi Municipality"],
  "Kaski": ["Pokhara Metropolitan City", "Annapurna Rural Municipality"],
  "Rupandehi": ["Butwal Sub-Metropolitan City", "Siddharthanagar Municipality"],
  // Default for others to allow demo to work generally
  "Default": ["Municipality A", "Municipality B", "Rural Municipality C"]
};

export const MOCK_CONSTITUENCIES: Constituency[] = [
  { id: "ktm-1", name: "Kathmandu 1", province: "Bagmati Province", district: "Kathmandu", mp_name: "Prakash Man Singh", mp_image: "https://picsum.photos/200/200?random=1" },
  { id: "ktm-2", name: "Kathmandu 2", province: "Bagmati Province", district: "Kathmandu", mp_name: "Sobita Gautam", mp_image: "https://picsum.photos/200/200?random=2" },
  { id: "ktm-3", name: "Kathmandu 3", province: "Bagmati Province", district: "Kathmandu", mp_name: "Santosh Chalise", mp_image: "https://picsum.photos/200/200?random=3" },
  { id: "lal-1", name: "Lalitpur 1", province: "Bagmati Province", district: "Lalitpur", mp_name: "Udaya Shamsher Rana", mp_image: "https://picsum.photos/200/200?random=4" },
  { id: "lal-2", name: "Lalitpur 2", province: "Bagmati Province", district: "Lalitpur", mp_name: "Prem Bahadur Maharjan", mp_image: "https://picsum.photos/200/200?random=5" },
  { id: "lal-3", name: "Lalitpur 3", province: "Bagmati Province", district: "Lalitpur", mp_name: "Toshima Karki", mp_image: "https://picsum.photos/200/200?random=6" },
  { id: "kas-1", name: "Kaski 1", province: "Gandaki Province", district: "Kaski" },
  { id: "kas-2", name: "Kaski 2", province: "Gandaki Province", district: "Kaski" },
  { id: "rup-1", name: "Rupandehi 1", province: "Lumbini Province", district: "Rupandehi" },
  { id: "rup-2", name: "Rupandehi 2", province: "Lumbini Province", district: "Rupandehi", mp_name: "Bishnu Paudel", mp_image: "https://picsum.photos/200/200?random=7" },
];