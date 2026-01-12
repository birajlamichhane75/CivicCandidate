import { Constituency } from "./types";

export const PROVINCES = [
  "Bagmati Province",
  "Madhesh Province"
];

export const DISTRICTS: Record<string, string[]> = {
  "Bagmati Province": ["Bhaktapur", "Kathmandu"],
  "Madhesh Province": ["Bara"]
};

export const MUNICIPALITIES: Record<string, string[]> = {
  "Bhaktapur": [
    "Bhaktapur Municipality", 
    "Changunarayan Municipality"
  ],
  "Bara": [
    "Kalaiya Sub-Metropolitan City", 
    "Pheta Rural Municipality", 
    "Jitpur Simara Sub-Metropolitan City"
  ],
  "Kathmandu": [
    "Kathmandu Metropolitan City",
    "Nagarjun Municipality",
    "Tarakeshwar Municipality"
  ]
};

// Helper to generate range array [start, start+1, ..., end]
const range = (start: number, end: number) => Array.from({length: (end - start) + 1}, (_, k) => (k + start).toString());

// Specific Ward Mapping based on Constituency Rules
export const WARDS: Record<string, string[]> = {
  // Bhaktapur 1
  "Bhaktapur Municipality": range(1, 10), // Wards 1-10
  "Changunarayan Municipality": range(1, 9), // Wards 1-9
  
  // Bara 3
  "Kalaiya Sub-Metropolitan City": [...range(1, 16), ...range(18, 27)], // Wards 1-16 and 18-27
  "Pheta Rural Municipality": range(5, 7), // Wards 5-7
  "Jitpur Simara Sub-Metropolitan City": range(11, 18), // Wards 11-18

  // Kathmandu 7
  "Kathmandu Metropolitan City": ["16", "17", "18", "25"],
  "Nagarjun Municipality": ["1", "2", "3"],
  "Tarakeshwar Municipality": ["3", "4", "5"]
};

// Hardcoded Constituencies for the limited version
export const MOCK_CONSTITUENCIES: Constituency[] = [
  {
    id: "bhaktapur-1",
    name: "Bhaktapur 1",
    province: "Bagmati Province",
    district: "Bhaktapur",
    mp_name: "Prem Suwal", 
    mp_image: "https://upload.wikimedia.org/wikipedia/commons/4/46/Prem_Suwal.jpg"
  },
  {
    id: "bara-3",
    name: "Bara 3",
    province: "Madhesh Province",
    district: "Bara",
    mp_name: "Jwala Kumari Sah", 
    mp_image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Jwala_Kumari_Sah.jpg/440px-Jwala_Kumari_Sah.jpg"
  },
  {
    id: "kathmandu-7",
    name: "Kathmandu 7",
    province: "Bagmati Province",
    district: "Kathmandu",
    mp_name: "Ganesh Parajuli", 
    mp_image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Ganesh_Parajuli.jpg/640px-Ganesh_Parajuli.jpg"
  }
];