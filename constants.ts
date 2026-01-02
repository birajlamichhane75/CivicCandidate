import { Constituency } from "./types";

export const PROVINCES = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province"
];

export const DISTRICTS: Record<string, string[]> = {
  "Koshi Province": [
    "Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", "Okhaldhunga", 
    "Panchthar", "Sankhuwasabha", "Solukhumbu", "Sunsari", "Taplejung", "Terhathum", "Udayapur"
  ],
  "Madhesh Province": [
    "Bara", "Dhanusa", "Mahottari", "Parsa", "Rautahat", "Saptari", "Sarlahi", "Siraha"
  ],
  "Bagmati Province": [
    "Bhaktapur", "Chitwan", "Dhading", "Dolakha", "Kathmandu", "Kavrepalanchok", 
    "Lalitpur", "Makwanpur", "Nuwakot", "Ramechhap", "Rasuwa", "Sindhuli", "Sindhupalchok"
  ],
  "Gandaki Province": [
    "Baglung", "Gorkha", "Kaski", "Lamjung", "Manang", "Mustang", "Myagdi", "Nawalpur", 
    "Parbat", "Syangja", "Tanahun"
  ],
  "Lumbini Province": [
    "Arghakhanchi", "Banke", "Bardiya", "Dang", "Gulmi", "Kapilvastu", 
    "Nawalparasi West", "Palpa", "Pyuthan", "Rolpa", "Rukum East", "Rupandehi"
  ],
  "Karnali Province": [
    "Dailekh", "Dolpa", "Humla", "Jajarkot", "Jumla", "Kalikot", 
    "Mugu", "Rukum West", "Salyan", "Surkhet"
  ],
  "Sudurpashchim Province": [
    "Achham", "Bajhang", "Bajura", "Baitadi", "Dadeldhura", 
    "Darchula", "Doti", "Kailali", "Kanchanpur"
  ]
};

// Simplified Municipalities map (Generic fallback for demo)
export const MUNICIPALITIES: Record<string, string[]> = {
  "Kathmandu": ["Kathmandu Metropolitan City", "Kirtipur Municipality", "Chandragiri Municipality", "Tokha Municipality"],
  "Lalitpur": ["Lalitpur Metropolitan City", "Mahalaxmi Municipality", "Godawari Municipality"],
  "Bhaktapur": ["Bhaktapur Municipality", "Madhyapur Thimi Municipality", "Suryabinayak Municipality"],
  "Kaski": ["Pokhara Metropolitan City", "Annapurna Rural Municipality", "Machhapuchhre Rural Municipality"],
  "Jhapa": ["Birtamod Municipality", "Damak Municipality", "Mechinagar Municipality"],
  "Morang": ["Biratnagar Metropolitan City", "Sundarharaincha Municipality"],
  "Sunsari": ["Itahari Sub-Metropolitan City", "Dharan Sub-Metropolitan City"],
  "Chitwan": ["Bharatpur Metropolitan City", "Ratnanagar Municipality"],
  "Rupandehi": ["Butwal Sub-Metropolitan City", "Siddharthanagar Municipality", "Tilottama Municipality"],
  "Default": ["Municipality A", "Municipality B", "Rural Municipality C", "Rural Municipality D"]
};

// Map of District Name -> Number of Constituencies
const CONSTITUENCY_COUNTS: Record<string, number> = {
  // Koshi (28)
  "Taplejung": 1, "Panchthar": 1, "Ilam": 2, "Jhapa": 5, "Sankhuwasabha": 1, 
  "Terhathum": 1, "Bhojpur": 1, "Dhankuta": 1, "Morang": 6, "Sunsari": 4, 
  "Solukhumbu": 1, "Khotang": 1, "Okhaldhunga": 1, "Udayapur": 2,

  // Madhesh (32)
  "Saptari": 4, "Siraha": 4, "Dhanusa": 4, "Mahottari": 4, "Sarlahi": 4, 
  "Rautahat": 4, "Bara": 4, "Parsa": 4,

  // Bagmati (33)
  "Dolakha": 1, "Ramechhap": 1, "Sindhuli": 2, "Kavrepalanchok": 2, 
  "Sindhupalchok": 2, "Rasuwa": 1, "Nuwakot": 2, "Dhading": 2, "Chitwan": 3, 
  "Makwanpur": 2, "Bhaktapur": 2, "Lalitpur": 3, "Kathmandu": 10,

  // Gandaki (18)
  "Gorkha": 2, "Manang": 1, "Lamjung": 1, "Kaski": 3, "Tanahun": 2, 
  "Syangja": 2, "Nawalpur": 2, "Mustang": 1, "Myagdi": 1, "Baglung": 2, "Parbat": 1,

  // Lumbini (26)
  "Gulmi": 2, "Palpa": 2, "Rupandehi": 5, "Kapilvastu": 3, "Arghakhanchi": 1, 
  "Pyuthan": 1, "Rolpa": 1, "Rukum East": 1, "Dang": 3, "Banke": 3, 
  "Bardiya": 2, "Nawalparasi West": 2,

  // Karnali (12)
  "Salyan": 1, "Dolpa": 1, "Mugu": 1, "Jumla": 1, "Kalikot": 1, "Humla": 1, 
  "Jajarkot": 1, "Dailekh": 2, "Surkhet": 2, "Rukum West": 1,

  // Sudurpashchim (16)
  "Bajura": 1, "Bajhang": 1, "Darchula": 1, "Baitadi": 1, "Dadeldhura": 1, 
  "Doti": 1, "Achham": 2, "Kailali": 5, "Kanchanpur": 3
};

// Helper to generate IDs
const generateConstituencies = () => {
  const list: Constituency[] = [];
  
  Object.entries(DISTRICTS).forEach(([province, districts]) => {
    districts.forEach(district => {
      const count = CONSTITUENCY_COUNTS[district] || 1;
      for (let i = 1; i <= count; i++) {
        // ID Format: district-number (e.g., kathmandu-1, nawalparasi-west-2)
        const id = `${district.toLowerCase().replace(/\s+/g, '-')}-${i}`;
        
        let displayDistrict = district;
        let displayName = `${district} ${i}`;

        // Handle specific naming for split districts if needed for display
        if (district === 'Nawalpur') displayDistrict = 'Nawalparasi East';
        
        list.push({
          id: id,
          name: displayName,
          province: province,
          district: displayDistrict,
          mp_name: undefined
        });
      }
    });
  });

  return list;
};

export const MOCK_CONSTITUENCIES: Constituency[] = generateConstituencies();