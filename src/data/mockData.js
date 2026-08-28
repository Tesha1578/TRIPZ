// Mock Data for TRIPZ

export const DESTINATIONS = [
  {
    id: "goa",
    name: "Goa",
    state: "Goa",
    description: "Sun-kissed beaches, vibrant nightlife, Portuguese heritage, and delicious seafood.",
    tags: ["beach", "nightlife", "food", "adventure"],
    avg_daily_budget: 3500, // in INR
    best_months: ["November", "December", "January", "February"],
    crowd_level_by_month: {
      January: "High", February: "Medium", March: "Low", April: "Low",
      May: "Low", June: "Low", July: "Low", August: "Low",
      September: "Low", October: "Medium", November: "High", December: "High"
    },
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    lat: 15.2993,
    lng: 74.1240,
    eco_score: 68
  },
  {
    id: "munnar",
    name: "Munnar",
    state: "Kerala",
    description: "Lush tea plantations, misty hills, winding roads, and serene waterfalls.",
    tags: ["hill station", "waterfall", "adventure"],
    avg_daily_budget: 2500,
    best_months: ["September", "October", "November", "December", "January", "February", "March", "April"],
    crowd_level_by_month: {
      January: "Medium", February: "Medium", March: "Low", April: "Low",
      May: "Medium", June: "Low", July: "Low", August: "Low",
      September: "Medium", October: "High", November: "High", December: "High"
    },
    image_url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
    lat: 10.0889,
    lng: 77.0595,
    eco_score: 92
  },
  {
    id: "udaipur",
    name: "Udaipur",
    state: "Rajasthan",
    description: "The City of Lakes, filled with majestic palaces, heritage walks, and royal architecture.",
    tags: ["heritage", "food", "romantic"],
    avg_daily_budget: 3000,
    best_months: ["October", "November", "December", "January", "February", "March"],
    crowd_level_by_month: {
      January: "High", February: "High", March: "Medium", April: "Low",
      May: "Low", June: "Low", July: "Medium", August: "Medium",
      September: "Medium", October: "High", November: "High", December: "High"
    },
    image_url: "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=600&q=80",
    lat: 24.5854,
    lng: 73.7125,
    eco_score: 75
  },
  {
    id: "manali",
    name: "Manali",
    state: "Himachal Pradesh",
    description: "Snow-capped peaks, paragliding, Solang Valley, and riverside cafes.",
    tags: ["hill station", "adventure", "waterfall"],
    avg_daily_budget: 2800,
    best_months: ["October", "November", "December", "January", "February", "March", "April", "May", "June"],
    crowd_level_by_month: {
      January: "High", February: "Medium", March: "Medium", April: "High",
      May: "High", June: "High", July: "Low", August: "Low",
      September: "Medium", October: "Medium", November: "Medium", December: "High"
    },
    image_url: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80",
    lat: 32.2396,
    lng: 77.1887,
    eco_score: 82
  },
  {
    id: "ladakh",
    name: "Ladakh",
    state: "Jammu & Kashmir",
    description: "Stunning cold deserts, high passes, Pangong Lake, and beautiful Buddhist monasteries.",
    tags: ["adventure", "hill station", "heritage"],
    avg_daily_budget: 4500,
    best_months: ["June", "July", "August", "September"],
    crowd_level_by_month: {
      January: "Low", February: "Low", March: "Low", April: "Medium",
      May: "High", June: "High", July: "High", August: "High",
      September: "High", October: "Medium", November: "Low", December: "Low"
    },
    image_url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
    lat: 34.1526,
    lng: 77.5771,
    eco_score: 96
  },
  {
    id: "hampi",
    name: "Hampi",
    state: "Karnataka",
    description: "Ancient boulder-strewn landscapes, ruins of the Vijayanagara Empire, and coracle rides.",
    tags: ["heritage", "adventure", "history"],
    avg_daily_budget: 1800,
    best_months: ["October", "November", "December", "January", "February"],
    crowd_level_by_month: {
      January: "High", February: "Medium", March: "Low", April: "Low",
      May: "Low", June: "Low", July: "Low", August: "Medium",
      September: "Medium", October: "High", November: "High", December: "High"
    },
    image_url: "https://images.unsplash.com/photo-1600100397608-f0107770ed22?auto=format&fit=crop&w=600&q=80",
    lat: 15.3350,
    lng: 76.4600,
    eco_score: 88
  },
  {
    id: "rishikesh",
    name: "Rishikesh",
    state: "Uttarakhand",
    description: "The Yoga Capital, famous for river rafting, cafes, suspension bridges, and evening Ganga Aarti.",
    tags: ["adventure", "food", "heritage"],
    avg_daily_budget: 2000,
    best_months: ["September", "October", "November", "March", "April", "May"],
    crowd_level_by_month: {
      January: "Medium", February: "Medium", March: "High", April: "High",
      May: "High", June: "High", July: "Medium", August: "Medium",
      September: "Medium", October: "High", November: "High", December: "Medium"
    },
    image_url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80",
    lat: 30.0869,
    lng: 78.2676,
    eco_score: 90
  },
  {
    id: "pondicherry",
    name: "Pondicherry",
    state: "Puducherry",
    description: "French quarters, clean beaches, Auroville spiritual community, and bakeries.",
    tags: ["beach", "food", "heritage", "nightlife"],
    avg_daily_budget: 2500,
    best_months: ["October", "November", "December", "January", "February", "March"],
    crowd_level_by_month: {
      January: "High", February: "Medium", March: "Low", April: "Low",
      May: "Low", June: "Low", July: "Medium", August: "Medium",
      September: "Medium", October: "High", November: "High", December: "High"
    },
    image_url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
    lat: 11.9416,
    lng: 79.8083,
    eco_score: 78
  }
];

export const HOTELS = {
  goa: [
    { id: "h-g1", name: "Zostel Goa (Calangute)", price_range: "Budget", price: 800, rating: 4.5, lat: 15.5414, lng: 73.7634, link: "https://zostel.com" },
    { id: "h-g2", name: "Stamps Backpackers Hostel", price_range: "Budget", price: 600, rating: 4.7, lat: 15.5925, lng: 73.7432, link: "https://hostelworld.com" },
    { id: "h-g3", name: "Fairfield by Marriott Anjuna", price_range: "Premium", price: 6500, rating: 4.4, lat: 15.5786, lng: 73.7582, link: "https://marriott.com" },
    { id: "h-g4", name: "The Park Calangute", price_range: "Premium", price: 8000, rating: 4.2, lat: 15.5401, lng: 73.7548, link: "https://theparkhotels.com" }
  ],
  munnar: [
    { id: "h-m1", name: "Munnar Backpackers Hostel", price_range: "Budget", price: 500, rating: 4.3, lat: 10.0825, lng: 77.0601, link: "https://hostelworld.com" },
    { id: "h-m2", name: "Green Valley Cottages", price_range: "Budget", price: 1200, rating: 4.1, lat: 10.0911, lng: 77.0682, link: "https://booking.com" },
    { id: "h-m3", name: "The Fog Munnar Resort & Spa", price_range: "Premium", price: 7500, rating: 4.8, lat: 9.9876, lng: 77.0221, link: "https://thefogmunnar.com" }
  ],
  udaipur: [
    { id: "h-u1", name: "Moustache Hostel Udaipur", price_range: "Budget", price: 550, rating: 4.6, lat: 24.5779, lng: 73.6822, link: "https://moustachehostel.com" },
    { id: "h-u2", name: "Lakeside Heritage Homestay", price_range: "Budget", price: 1400, rating: 4.4, lat: 24.5791, lng: 73.6841, link: "https://airbnb.com" },
    { id: "h-u3", name: "Taj Lake Palace", price_range: "Premium", price: 38000, rating: 4.9, lat: 24.5753, lng: 73.6803, link: "https://tajhotels.com" }
  ],
  manali: [
    { id: "h-mn1", name: "Alt Life Manali (Old Manali)", price_range: "Budget", price: 700, rating: 4.7, lat: 32.2530, lng: 77.1812, link: "https://altlife.in" },
    { id: "h-mn2", name: "The Orchard Greens", price_range: "Budget", price: 2200, rating: 4.3, lat: 32.2381, lng: 77.1855, link: "https://booking.com" },
    { id: "h-mn3", name: "Span Resort & Spa", price_range: "Premium", price: 12000, rating: 4.8, lat: 32.1388, lng: 77.1722, link: "https://spanresorts.com" }
  ],
  ladakh: [
    { id: "h-l1", name: "Raybo Hostel Leh", price_range: "Budget", price: 650, rating: 4.5, lat: 34.1642, lng: 77.5855, link: "https://hostelworld.com" },
    { id: "h-l2", name: "The Grand Dragon Ladakh", price_range: "Premium", price: 9500, rating: 4.8, lat: 34.1558, lng: 77.5801, link: "https://thegranddragonladakh.com" }
  ],
  hampi: [
    { id: "h-hp1", name: "Hampi Backpackers (Hippie Island side)", price_range: "Budget", price: 450, rating: 4.2, lat: 15.3421, lng: 76.4632, link: "https://hostelworld.com" },
    { id: "h-hp2", name: "Heritage Resort Hampi", price_range: "Premium", price: 5800, rating: 4.5, lat: 15.3122, lng: 76.4101, link: "https://hampiresort.com" }
  ],
  rishikesh: [
    { id: "h-r1", name: "Skyard Hostel", price_range: "Budget", price: 450, rating: 4.6, lat: 30.1251, lng: 78.3242, link: "https://hostelworld.com" },
    { id: "h-r2", name: "Aloha On The Ganges", price_range: "Premium", price: 9000, rating: 4.7, lat: 30.1345, lng: 78.3301, link: "https://alohaontheganges.com" }
  ],
  pondicherry: [
    { id: "h-p1", name: "Ostonic French Villa", price_range: "Budget", price: 1100, rating: 4.2, lat: 11.9325, lng: 79.8312, link: "https://booking.com" },
    { id: "h-p2", name: "La Villa Heritage Hotel", price_range: "Premium", price: 9500, rating: 4.9, lat: 11.9367, lng: 79.8344, link: "https://lavillapondicherry.com" }
  ]
};

export const RESTAURANTS = {
  goa: [
    { id: "r-g1", name: "Curlies Beach Shack (Anjuna)", cuisine_type: "Goan Seafood & Continental", price_range: "Budget", veg_nonveg: "Non-Veg", rating: 4.1 },
    { id: "r-g2", name: "Artjuna Cafe (Anjuna)", cuisine_type: "Mediterranean & Vegan", price_range: "Medium", veg_nonveg: "Veg", rating: 4.6 },
    { id: "r-g3", name: "Gunpowder (Assagao)", cuisine_type: "South Indian Fusion", price_range: "Premium", veg_nonveg: "Non-Veg", rating: 4.7 },
    { id: "r-g4", name: "Vinayak Family Restaurant", cuisine_type: "Traditional Goan Fish Thali", price_range: "Budget", veg_nonveg: "Non-Veg", rating: 4.5 }
  ],
  munnar: [
    { id: "r-m1", name: "Rapsy Restaurant", cuisine_type: "Kerala & Biryani", price_range: "Budget", veg_nonveg: "Non-Veg", rating: 4.2 },
    { id: "r-m2", name: "Saravana Bhavan", cuisine_type: "South Indian Vegetarian", price_range: "Budget", veg_nonveg: "Veg", rating: 4.4 }
  ],
  udaipur: [
    { id: "r-u1", name: "Ambrai Restaurant", cuisine_type: "Mewari & North Indian", price_range: "Premium", veg_nonveg: "Non-Veg", rating: 4.5 },
    { id: "r-u2", name: "Jheel's Ginger Coffee Bar", cuisine_type: "Cafe & Italian", price_range: "Budget", veg_nonveg: "Veg", rating: 4.3 }
  ],
  manali: [
    { id: "r-mn1", name: "Cafe 1947 (Old Manali)", cuisine_type: "Italian & Woodfire Pizza", price_range: "Medium", veg_nonveg: "Non-Veg", rating: 4.6 },
    { id: "r-mn2", name: "Chopsticks (Mall Road)", cuisine_type: "Tibetan & Chinese", price_range: "Budget", veg_nonveg: "Non-Veg", rating: 4.3 }
  ],
  ladakh: [
    { id: "r-l1", name: "Gesmo Restaurant (Leh)", cuisine_type: "Yak Cheese Pizza & Tibetan", price_range: "Budget", veg_nonveg: "Non-Veg", rating: 4.4 },
    { id: "r-l2", name: "Leh Cafe", cuisine_type: "Traditional Thukpa & Momos", price_range: "Budget", veg_nonveg: "Veg", rating: 4.2 }
  ],
  hampi: [
    { id: "r-hp1", name: "Mango Tree Restaurant", cuisine_type: "North Indian & South Indian Thali", price_range: "Budget", veg_nonveg: "Veg", rating: 4.5 },
    { id: "r-hp2", name: "Laughing Buddha Cafe", cuisine_type: "Global Comfort Food", price_range: "Budget", veg_nonveg: "Non-Veg", rating: 4.3 }
  ],
  rishikesh: [
    { id: "r-r1", name: "Little Buddha Cafe", cuisine_type: "Organic & Global", price_range: "Budget", veg_nonveg: "Veg", rating: 4.4 },
    { id: "r-r2", name: "Chotiwala Restaurant", cuisine_type: "Traditional Indian Thali", price_range: "Budget", veg_nonveg: "Veg", rating: 4.1 }
  ],
  pondicherry: [
    { id: "r-p1", name: "Baker Street", cuisine_type: "French Bakery & Pastries", price_range: "Budget", veg_nonveg: "Non-Veg", rating: 4.5 },
    { id: "r-p2", name: "Surguru Restaurant", cuisine_type: "South Indian Vegetarian", price_range: "Budget", veg_nonveg: "Veg", rating: 4.3 }
  ]
};

export const EMERGENCY_CONTACTS = {
  goa: {
    police: "100 / 0832-2428400",
    hospitals: [
      { name: "Goa Medical College & Hospital", phone: "0832-2458727", location: "Bambolim" },
      { name: "Manipal Hospital Goa", phone: "0832-3041000", location: "Dona Paula" }
    ],
    helpline: "112 / 1091 (Women Helpline)"
  },
  munnar: {
    police: "04865-230321",
    hospitals: [
      { name: "Tata General Hospital", phone: "04865-230270", location: "Munnar Town" },
      { name: "General Hospital Munnar", phone: "04865-230263", location: "Nullatanni" }
    ],
    helpline: "112 / 1095"
  },
  udaipur: {
    police: "0294-2419041",
    hospitals: [
      { name: "Geetanjali Hospital", phone: "0294-2500000", location: "Eklingpura" },
      { name: "GBH American Hospital", phone: "0294-3536000", location: "Bhatt Ji Ki Bari" }
    ],
    helpline: "112 / 1090"
  },
  manali: {
    police: "01902-252326",
    hospitals: [
      { name: "Lady Willingdon Hospital", phone: "01902-252309", location: "Bazaar Road" },
      { name: "Civil Hospital Manali", phone: "01902-253385", location: "Rangri" }
    ],
    helpline: "112 / 104 (Health Helpline)"
  },
  ladakh: {
    police: "01982-252298",
    hospitals: [
      { name: "SNM Hospital Leh", phone: "01982-253629", location: "Leh Town" }
    ],
    helpline: "112 / 1095"
  },
  hampi: {
    police: "08394-241224",
    hospitals: [
      { name: "Government Hospital Hospet", phone: "08394-220033", location: "Hospet (13km away)" }
    ],
    helpline: "112 / 1098"
  },
  rishikesh: {
    police: "0135-2430012",
    hospitals: [
      { name: "AIIMS Rishikesh", phone: "0135-2452927", location: "Virbhadra Road" },
      { name: "Nirmal Ashram Hospital", phone: "0135-2430942", location: "Mayakund" }
    ],
    helpline: "112 / 108"
  },
  pondicherry: {
    police: "0413-2231100",
    hospitals: [
      { name: "JIPMER Hospital", phone: "0413-2272380", location: "Gorimedu" },
      { name: "Pondicherry Institute of Medical Sciences", phone: "0413-2656271", location: "Kalapet" }
    ],
    helpline: "112 / 1091"
  }
};

export const TRANSLATIONS = {
  Goa: {
    language: "Konkani",
    common: [
      { english: "Hello", native: "Dev borem korum", pronunciation: "Dev bo-rem ko-rum" },
      { english: "Thank you", native: "Dev borem korum", pronunciation: "Dev bo-rem ko-rum" },
      { english: "How much is this?", native: "Hachen mol kitlem?", pronunciation: "Ha-chen mol kit-lem?" },
      { english: "Where is the beach?", native: "Weli khoi asa?", pronunciation: "We-li khoi a-sa?" },
      { english: "Help me", native: "Mhaka modot kor", pronunciation: "Mha-ka mo-dot kor" }
    ]
  },
  Kerala: {
    language: "Malayalam",
    common: [
      { english: "Hello / Welcome", native: "Namaskaram", pronunciation: "Na-mas-ka-ram" },
      { english: "Thank you", native: "Nandi", pronunciation: "Nan-di" },
      { english: "How much is this?", native: "Ithinju ethrayaayi?", pronunciation: "I-thin-ju eth-ra-yaayi?" },
      { english: "Where is the hotel?", native: "Hotel evideyaanu?", pronunciation: "Ho-tel e-vi-de-yaa-nu?" },
      { english: "Water", native: "Vellam", pronunciation: "Vel-lam" }
    ]
  },
  Rajasthan: {
    language: "Hindi / Marwari",
    common: [
      { english: "Welcome", native: "Padharo Mhare Desh", pronunciation: "Pa-dhaa-ro mhaa-re desh" },
      { english: "Hello", native: "Ram Ram / Namaste", pronunciation: "Ram Ram / Na-mas-te" },
      { english: "Thank you", native: "Dhanyawaad", pronunciation: "Dhan-ya-vaad" },
      { english: "How much?", native: "Kitta rupiya?", pronunciation: "Kit-ta ru-pi-ya?" },
      { english: "Water", native: "Paani", pronunciation: "Paa-nee" }
    ]
  },
  "Himachal Pradesh": {
    language: "Hindi / Pahari",
    common: [
      { english: "Hello", native: "Namaste", pronunciation: "Na-mas-te" },
      { english: "How are you?", native: "Tuse kiyan ho?", pronunciation: "Tu-se ki-yan ho?" },
      { english: "Thank you", native: "Dhanyawaad", pronunciation: "Dhan-ya-vaad" },
      { english: "How much for this?", native: "Eh kitne da hai?", pronunciation: "Eh kit-ne da hai?" }
    ]
  },
  "Jammu & Kashmir": {
    language: "Ladakhi / Tibetan",
    common: [
      { english: "Hello / Welcome", native: "Julley", pronunciation: "Joo-lay" },
      { english: "Thank you", native: "Julley", pronunciation: "Joo-lay" },
      { english: "How are you?", native: "Khamzang?", pronunciation: "Kham-zang?" },
      { english: "Where is Pangong?", native: "Pangong khoba yod?", pronunciation: "Pan-gong kho-ba yod?" }
    ]
  },
  Karnataka: {
    language: "Kannada",
    common: [
      { english: "Hello", native: "Namaskara", pronunciation: "Na-mas-kaa-ra" },
      { english: "Thank you", native: "Dhanyavadagalu", pronunciation: "Dhan-ya-va-da-ga-lu" },
      { english: "How much?", native: "Eshtu?", pronunciation: "Esh-tu?" },
      { english: "Where is the temple?", native: "Devalaya ellide?", pronunciation: "De-vaa-la-ya el-li-de?" }
    ]
  },
  Uttarakhand: {
    language: "Hindi / Garhwali",
    common: [
      { english: "Hello / Greeting", native: "Namaskar / Paalag", pronunciation: "Na-mas-kar / Paa-lag" },
      { english: "How are you?", native: "Tumi kika chho?", pronunciation: "Tu-mi ki-ka chho?" },
      { english: "Thank you", native: "Dhanyawaad", pronunciation: "Dhan-ya-vaad" },
      { english: "Water", native: "Paani", pronunciation: "Paa-nee" }
    ]
  },
  Puducherry: {
    language: "Tamil / French",
    common: [
      { english: "Hello", native: "Vanakkam / Bonjour", pronunciation: "Va-nak-kam / Bon-joor" },
      { english: "Thank you", native: "Nandri / Merci", pronunciation: "Nan-dri / Mair-see" },
      { english: "How much is this?", native: "Ithu yevalavu? / C'est combien?", pronunciation: "I-thu ya-va-la-vu? / Say com-by-an?" },
      { english: "Where is the beach?", native: "Kadal karai yenge? / Où est la plage?", pronunciation: "Ka-dal ka-rai yen-ge? / Oo ay la plazh?" }
    ]
  }
};

export const MOCK_ITINERARIES = {
  goa: {
    days: [
      {
        day: 1,
        date: "Day 1",
        morning: "Check-in at hostel, breakfast at Artjuna cafe, and relax under coconut palms at Anjuna Beach.",
        afternoon: "Explore the historic Chapora Fort (Dil Chahta Hai point) and grab a Goan fish thali at Vinayak Restaurant.",
        evening: "Sunset walk on Vagator beach, followed by live music and seafood dinner at Curlies Beach Shack.",
        estimated_cost: 1500,
        travel_notes: "Rent a scooter (₹350/day) for easy travel between beaches.",
        stops: [
          { name: "Anjuna Beach", lat: 15.5804, lng: 73.7423 },
          { name: "Chapora Fort", lat: 15.6062, lng: 73.7348 },
          { name: "Vagator Beach", lat: 15.5992, lng: 73.7371 }
        ]
      },
      {
        day: 2,
        date: "Day 2",
        morning: "Wake up early for a refreshing swim at Calangute Beach, followed by water sports (jet ski/parasailing).",
        afternoon: "Lunch at Infantaria cafe, then drive to Fontainhas (French-style Latin Quarter of Panaji) for a heritage photography walk.",
        evening: "Mandovi River sunset cruise, local shopping at Panjim market, and dinner at Gunpowder Assagao.",
        estimated_cost: 2500,
        travel_notes: "Panaji is 20km from North Goa beaches. Budget around ₹800 if hiring a local taxi.",
        stops: [
          { name: "Calangute Beach", lat: 15.5494, lng: 73.7535 },
          { name: "Fontainhas Panaji", lat: 15.4989, lng: 73.8278 },
          { name: "Panjim Market", lat: 15.4962, lng: 73.8310 }
        ]
      },
      {
        day: 3,
        date: "Day 3",
        morning: "Drive to Old Goa to visit the historical Basilica of Bom Jesus (UNESCO site) and Se Cathedral.",
        afternoon: "Take a guided spice plantation tour in Ponda, including a traditional buffet lunch served on banana leaves.",
        evening: "Return to North Goa, check out the Saturday Night Market (Arpora), and enjoy dinner at Purple Martini.",
        estimated_cost: 1800,
        travel_notes: "Wear comfortable walking shoes for the basilica and spice tour.",
        stops: [
          { name: "Basilica of Bom Jesus", lat: 15.5009, lng: 73.9116 },
          { name: "Sahakari Spice Farm", lat: 15.4221, lng: 74.0155 },
          { name: "Saturday Night Market", lat: 15.5684, lng: 73.7699 }
        ]
      }
    ]
  },
  munnar: {
    days: [
      {
        day: 1,
        date: "Day 1",
        morning: "Arrival in Munnar, breakfast in Munnar town, and check-in. Hike through the nearby tea gardens.",
        afternoon: "Visit the Munnar Tea Museum to learn tea-processing history, and lunch at Saravana Bhavan.",
        evening: "Scenic drive to Lockhart Gap view point, photography session, and traditional Kerala dinner at Rapsy.",
        estimated_cost: 900,
        travel_notes: "Auto-rickshaws are available for local transit. Standard fare is ₹150 for short rides.",
        stops: [
          { name: "Munnar Town", lat: 10.0889, lng: 77.0595 },
          { name: "Tea Museum", lat: 10.0934, lng: 77.0556 },
          { name: "Lockhart Gap", lat: 10.0461, lng: 77.1082 }
        ]
      },
      {
        day: 2,
        date: "Day 2",
        morning: "Early morning drive to Eravikulam National Park (Rajamalai) to spot the rare Nilgiri Tahr mountain goat.",
        afternoon: "Visit Lakkam Waterfalls, enjoy a short forest trek, and have a local Kerala-style meals at a roadside eatery.",
        evening: "Boating at Mattupetty Dam, visiting Echo Point (shout out your name to hear echoes!), and dinner at hotel.",
        estimated_cost: 1600,
        travel_notes: "National Park tickets should be booked online in advance to avoid queues.",
        stops: [
          { name: "Eravikulam National Park", lat: 10.1501, lng: 77.0221 },
          { name: "Lakkam Waterfalls", lat: 10.1812, lng: 77.0422 },
          { name: "Mattupetty Dam", lat: 10.1062, lng: 77.1219 }
        ]
      }
    ]
  },
  udaipur: {
    days: [
      {
        day: 1,
        date: "Day 1",
        morning: "Check in. Breakfast near Jagdish temple, then visit the massive City Palace complexes overlooking Lake Pichola.",
        afternoon: "Take a walking tour of the Old City lanes, browse colorful fabrics, and enjoy wood-fired pizza at Jheel's Cafe.",
        evening: "Scenic sunset boat ride on Lake Pichola (around Jag Mandir Palace), and dinner at lakefront Ambrai Restaurant.",
        estimated_cost: 2100,
        travel_notes: "Buy a combined ticket for Palace + Museum for better pricing.",
        stops: [
          { name: "Jagdish Temple", lat: 24.5794, lng: 73.6848 },
          { name: "City Palace", lat: 24.5764, lng: 73.6835 },
          { name: "Lake Pichola", lat: 24.5752, lng: 73.6789 }
        ]
      },
      {
        day: 2,
        date: "Day 2",
        morning: "Stroll through the gardens of Saheliyon-ki-Bari (Courtyard of Maidens) with beautiful lotus pools and fountains.",
        afternoon: "Visit Fateh Sagar Lake, take a boat to Nehru Park island, and enjoy spicy Rajasthani Mirchi Vada at street stalls.",
        evening: "Experience Dharohar folk dance show at Bagore-ki-Haveli, and dinner at a rooftop heritage restaurant.",
        estimated_cost: 1200,
        travel_notes: "The Bagore-ki-Haveli show starts at 7:00 PM; tickets sell out by 6:15 PM.",
        stops: [
          { name: "Saheliyon-ki-Bari", lat: 24.6022, lng: 73.6872 },
          { name: "Fateh Sagar Lake", lat: 24.5954, lng: 73.6761 },
          { name: "Bagore-ki-Haveli", lat: 24.5789, lng: 73.6821 }
        ]
      }
    ]
  }
};

// Fallback generator for un-mocked destinations
export function generateFallbackItinerary(destinationId, days, interests) {
  const destName = destinationId.toUpperCase();
  const list = [];
  const activities = {
    beach: ["Beach yoga & beach walks", "Jet ski, paragliding & surfing", "Coastal cruise, sunset cocktails & beach bonfire"],
    adventure: ["Early morning mountain trekking / hiking", "White-water rafting / rock climbing", "Ziplining / off-road jeep safari"],
    heritage: ["Historic fort explorations", "Museum & heritage walks", "Folk dance show / historical museum visit"],
    food: ["Local breakfast food walk", "Traditional culinary cooking class", "Spice market tour & street food dinner"],
    "hill station": ["Misty hill trekking & valley views", "Tea/Coffee estate walks", "Lake boating & sunset viewpoint"],
    waterfall: ["Trek to hidden waterfalls", "Natural rock pool swimming", "Riverside picnic & camping"],
    nightlife: ["Hostel social mixers", "Beach shack clubbing", "Night market shopping & rooftop barhopping"]
  };

  // Find relevant activities based on user's interests
  let selectedActivities = [];
  interests.forEach(interest => {
    if (activities[interest]) {
      selectedActivities = [...selectedActivities, ...activities[interest]];
    }
  });

  // Default fallback if no interests match
  if (selectedActivities.length === 0) {
    selectedActivities = [
      "Sightseeing around local heritage points",
      "Nature exploration & local lunch",
      "Sunset viewpoints & local marketplace walking"
    ];
  }

  // Ensure unique index access
  for (let i = 1; i <= days; i++) {
    const actIdx = (i - 1) * 3;
    const morning = selectedActivities[actIdx % selectedActivities.length];
    const afternoon = selectedActivities[(actIdx + 1) % selectedActivities.length];
    const evening = selectedActivities[(actIdx + 2) % selectedActivities.length];
    
    list.push({
      day: i,
      date: `Day ${i}`,
      morning: `Start Day ${i} in ${destName}: ${morning}. Enjoy local snacks.`,
      afternoon: `Continue exploration: ${afternoon}. Dine at a highly recommended local eatery.`,
      evening: `Wrap up Day ${i}: ${evening}. Relish the sunset/city lights.`,
      estimated_cost: 1200 + (i * 200),
      travel_notes: "Travel using shared cabs or auto rickshaws (estimated cost ₹400/day).",
      stops: [
        { name: `${destName} North Point`, lat: 15.0 + (i * 0.05), lng: 74.0 + (i * 0.05) },
        { name: `${destName} Center Point`, lat: 15.02 + (i * 0.05), lng: 74.03 + (i * 0.05) },
        { name: `${destName} South Point`, lat: 15.04 + (i * 0.05), lng: 74.04 + (i * 0.05) }
      ]
    });
  }

  return { days: list };
}

export const MOCK_LOCAL_LISTINGS = {
  goa: [
    { id: "l-g1", type: "guide", owner_name: "Rohan D'Souza", description: "Certified local heritage guide specializing in Old Goa church history & secret spice farms.", price: 1500, contact: "+91 98111 22233", rating: 4.9, verified: true },
    { id: "l-g2", type: "homestay", owner_name: "Maria's Portuguese Villa", description: "Cozy heritage room in a restored 19th-century villa, located 5 mins from Fontainhas.", price: 2200, contact: "+91 98111 22244", rating: 4.8, verified: true },
    { id: "l-g3", type: "experience", owner_name: "Backwater Kayaking Tour", description: "Eco-friendly morning kayak exploration through Sal backwaters and mangrove ecosystems.", price: 1200, contact: "+91 98111 22255", rating: 4.7, verified: true }
  ],
  munnar: [
    { id: "l-m1", type: "guide", owner_name: "Suresh Kumar", description: "Local estate expert for sunrise trekking to Kolukkumalai tea heights.", price: 1200, contact: "+91 98111 33344", rating: 4.9, verified: true },
    { id: "l-m2", type: "homestay", owner_name: "Mist Valley Organic Farmstay", description: "Eco-homestay surrounded by cardamom plantations; traditional Kerala home-cooked food.", price: 1800, contact: "+91 98111 33355", rating: 4.6, verified: true },
    { id: "l-m3", type: "experience", owner_name: "Kathakali & Kalaripayattu Show", description: "Traditional performing arts reservation with front-row seats at Punarjani Traditional Village.", price: 500, contact: "+91 98111 33366", rating: 4.8, verified: false }
  ],
  udaipur: [
    { id: "l-u1", type: "guide", owner_name: "Vikram Singh", description: "Heritage walk guide through City Palace, bagore ki haveli, and old bazaars.", price: 1000, contact: "+91 98111 44455", rating: 4.8, verified: true },
    { id: "l-u2", type: "homestay", owner_name: "Lakeview Haveli Homestay", description: "Traditional Rajasthani haveli room overlooking Lake Pichola with rooftop dining.", price: 2500, contact: "+91 98111 44466", rating: 4.7, verified: true }
  ],
  manali: [
    { id: "l-mn1", type: "guide", owner_name: "Tenzing Sherpa", description: "Paragliding pilot and certified mountain trekking lead for Solang and Beas Kund trail.", price: 2500, contact: "+91 98111 55566", rating: 4.9, verified: true },
    { id: "l-mn2", type: "homestay", owner_name: "Old Manali Wooden Cabin", description: "Rustic cedar wood cabin near Manu Temple; features bonfire nights and apple orchard surroundings.", price: 1600, contact: "+91 98111 55577", rating: 4.7, verified: true }
  ],
  ladakh: [
    { id: "l-l1", type: "guide", owner_name: "Stanzin Gyatso", description: "Leh-based local driver and permit facilitator for Pangong, Nubra Valley, and Khardung La.", price: 3500, contact: "+91 98111 66677", rating: 5.0, verified: true },
    { id: "l-l2", type: "homestay", owner_name: "Nubra Valley Eco-Homestay", description: "Warm Ladakhi family homestay in Diskit village with organic greenhouse dining.", price: 1500, contact: "+91 98111 66688", rating: 4.9, verified: true }
  ],
  hampi: [
    { id: "l-h1", type: "guide", owner_name: "Manjunath Raju", description: "Archaeological expert on Vijayanagara ruins, stone chariot, and Virupaksha Temple details.", price: 1200, contact: "+91 98111 77788", rating: 4.8, verified: true },
    { id: "l-h2", type: "homestay", owner_name: "Hampi Banana Farm Stay", description: "Peaceful stay amidst banana plantations with local food and coracle ferry access.", price: 1200, contact: "+91 98111 77799", rating: 4.6, verified: true }
  ],
  rishikesh: [
    { id: "l-r1", type: "guide", owner_name: "Swami Anand", description: "Yoga and meditation instructor offering private spiritual retreats and ganga beach walks.", price: 800, contact: "+91 98111 88899", rating: 4.9, verified: false },
    { id: "l-r2", type: "experience", owner_name: "Red Chilli Adventure Rafting", description: "Government-licensed white-water rafting from Shivpuri (16km) with complete safety gear.", price: 1000, contact: "+91 98111 88800", rating: 4.8, verified: true }
  ],
  pondicherry: [
    { id: "l-p1", type: "guide", owner_name: "Jean-Pierre", description: "Bilingual French-Tamil guide leading cycle tours through French Quarters and Heritage Town.", price: 1500, contact: "+91 98111 99900", rating: 4.7, verified: true },
    { id: "l-p2", type: "homestay", owner_name: "Auroville Eco Guest House", description: "Solar-powered serene cottage built with sustainable terracotta blocks.", price: 1800, contact: "+91 98111 99911", rating: 4.5, verified: true }
  ]
};

