/**
 * Sample business data for Rural & Regional Australian Business Directory
 * Contains 10 comprehensive business profiles across various industries and regions
 */

export const businessData = [
  {
    id: 1,
    name: "Esperance Grain & Livestock",
    location: {
      town: "Esperance",
      state: "WA",
      region: "Great Southern"
    },
    tagline: "Growing quality from the ground up - Esperance grain and genetics.",
    description: "Third-generation family farm operating 8,000 hectares of mixed cropping and merino sheep across the Esperance Plains. Specialising in premium wheat, barley, and canola production alongside fine wool genetics. Committed to sustainable farming practices and supporting local agricultural research through field trials and community partnerships.",
    keyFeatures: [
      "8,000 hectares mixed farming operation",
      "On-farm grain storage capacity: 5,000 tonnes",
      "Merino stud breeding program with genetic testing",
      "Seasonal employment for 15-20 local workers",
      "Direct sales to domestic and export markets",
      "Sustainable farming certification (GRDC approved)"
    ],
    categories: {
      primary: "Grain-Sheep Farming",
      anzsicCode: "0141",
      secondary: ["Livestock Breeding", "Crop Production"]
    },
    tags: {
      location: ["Great Southern WA", "Esperance Plains", "Goldfields-Esperance"],
      services: ["Premium grain", "Merino genetics", "Sustainable farming"]
    },
    industry: "agriculture"
  },
  {
    id: 2,
    name: "Riverland Mobile Shearing Services",
    location: {
      town: "Renmark",
      state: "SA",
      region: "Riverina/Murray River"
    },
    tagline: "Professional shearing across the basin - quality service, quality results.",
    description: "Professional shearing contractor servicing properties across the Murray-Darling Basin from the Riverland to western NSW. Operating six shearing teams with modern equipment and qualified AWI-trained shearers. Providing comprehensive wool harvesting, crutching, and livestock handling services to properties ranging from small hobby farms to large commercial operations.",
    keyFeatures: [
      "Service radius: 400km from Renmark base",
      "Six fully equipped shearing teams available",
      "All shearers AWI-certified and WHS trained",
      "Modern wool handling and pressing equipment",
      "Seasonal booking system (March-November priority)",
      "Livestock handling and basic veterinary services"
    ],
    categories: {
      primary: "Agricultural Support Services",
      anzsicCode: "0162",
      secondary: ["Livestock Services", "Wool Industry"]
    },
    tags: {
      location: ["SA Riverland", "Murray-Darling Basin", "Cross-border NSW"],
      services: ["Mobile shearing", "AWI certified", "Livestock handling"]
    },
    industry: "services"
  },
  {
    id: 3,
    name: "Griffith Rural Supplies & Hardware",
    location: {
      town: "Griffith",
      state: "NSW",
      region: "Riverina"
    },
    tagline: "Your local rural experts - supplies, service, and solutions since 1980.",
    description: "Community-focused rural retailer serving the Murrumbidgee Irrigation Area for over 40 years. Stocking everything from farming chemicals and irrigation supplies to household hardware and rural lifestyle products. Known for expert advice on crop protection, water management, and practical solutions for both commercial growers and rural families.",
    keyFeatures: [
      "Comprehensive agricultural chemical range (licensed dealer)",
      "Irrigation equipment sales, service, and installation",
      "Rural lifestyle and household hardware sections",
      "Technical advice from qualified agronomists on staff",
      "Delivery service throughout MIA region",
      "Credit accounts for established farming clients"
    ],
    categories: {
      primary: "Agricultural Supply Store",
      anzsicCode: "3999",
      secondary: ["Hardware Retail", "Irrigation Services"]
    },
    tags: {
      location: ["NSW Riverina", "Murrumbidgee Irrigation Area", "Griffith"],
      services: ["Agricultural supplies", "Technical advice", "Rural lifestyle"]
    },
    industry: "retail"
  },
  {
    id: 4,
    name: "Charleville Country Medical Centre",
    location: {
      town: "Charleville",
      state: "QLD",
      region: "Central West Queensland"
    },
    tagline: "Quality healthcare for our community - always here when you need us.",
    description: "Comprehensive rural health service providing general practice, emergency care, and specialist outreach services to South West Queensland communities. Our experienced doctors understand rural health challenges and work closely with Flying Doctor Service and regional hospitals to ensure quality healthcare reaches remote properties and smaller townships.",
    keyFeatures: [
      "Bulk billing available for eligible patients",
      "Emergency department operating 24/7",
      "Visiting specialists monthly (cardiology, orthopedics, mental health)",
      "Telehealth consultations for remote properties",
      "On-call doctor service for surrounding districts",
      "Women's health and family planning services"
    ],
    categories: {
      primary: "General Practice",
      anzsicCode: "8511",
      secondary: ["Emergency Services", "Rural Health"]
    },
    tags: {
      location: ["Central West QLD", "South West Queensland", "Maranoa Region"],
      services: ["Bulk billing", "Emergency care", "Telehealth", "Outreach"]
    },
    industry: "health"
  },
  {
    id: 5,
    name: "Gippsland Farm Machinery Repairs",
    location: {
      town: "Sale",
      state: "VIC",
      region: "Gippsland"
    },
    tagline: "Keeping Gippsland farming - expert repairs when and where you need them.",
    description: "Specialised agricultural machinery workshop serving East Gippsland's dairy and beef industries since 1995. Expert repairs and maintenance on tractors, harvesters, and dairy equipment with genuine parts and mobile service capabilities. Supporting local farmers with cost-effective solutions, seasonal payment plans, and emergency breakdown assistance during critical farming periods.",
    keyFeatures: [
      "Mobile workshop service covering 150km radius",
      "Specialisation in dairy equipment (milking systems, feeders)",
      "Emergency breakdown service during silage/harvest seasons",
      "Genuine parts supplier for major brands (Case IH, New Holland, Massey Ferguson)",
      "Seasonal payment plans for primary producers",
      "Pre-harvest machinery inspections and servicing"
    ],
    categories: {
      primary: "Agricultural Machinery Repair",
      anzsicCode: "8490",
      secondary: ["Mobile Repair Service", "Dairy Equipment"]
    },
    tags: {
      location: ["East Gippsland VIC", "Sale", "Latrobe Valley"],
      services: ["Mobile service", "Dairy specialist", "Emergency repairs"]
    },
    industry: "services"
  },
  {
    id: 6,
    name: "Top End Station Stays",
    location: {
      town: "Katherine",
      state: "NT",
      region: "Katherine Region"
    },
    tagline: "Experience authentic Territory station life - where adventure meets tradition.",
    description: "Authentic cattle station accommodation offering visitors genuine Outback experiences on a working 50,000-hectare property. Guests participate in daily station activities including mustering, yard work, and campfire cooking while learning about Top End pastoralism, indigenous culture, and unique Territory wildlife in comfortable homestead surroundings.",
    keyFeatures: [
      "Accommodation for up to 16 guests (homestead and workers' quarters)",
      "All meals included featuring locally sourced beef and produce",
      "Guided station activities: mustering, yard work, helicopter rides",
      "Indigenous cultural experiences with local Traditional Owners",
      "Wildlife watching: saltwater crocodiles, buffalo, bird species",
      "Seasonal operation (dry season April-October)"
    ],
    categories: {
      primary: "Farm Stay Accommodation",
      anzsicCode: "4401",
      secondary: ["Agritourism", "Cultural Tourism"]
    },
    tags: {
      location: ["Katherine Region NT", "Top End", "Victoria River District"],
      services: ["Station experience", "Indigenous culture", "Wildlife tourism"]
    },
    industry: "tourism"
  },
  {
    id: 7,
    name: "Northern Tablelands Accountancy Services",
    location: {
      town: "Armidale",
      state: "NSW",
      region: "Northern Tablelands"
    },
    tagline: "Rural accounting experts - understanding your business, planning your future.",
    description: "Specialist rural accounting practice serving primary producers and agribusiness across the New England region. Providing comprehensive tax planning, BAS preparation, and business advisory services with deep understanding of farming operations, seasonal cash flows, and agricultural tax concessions. Supporting clients through succession planning and drought management strategies.",
    keyFeatures: [
      "Primary producer tax specialisation and FMD planning",
      "BAS and GST services with rural understanding",
      "Business advisory for farm expansion and diversification",
      "Succession planning and intergenerational wealth transfer",
      "Drought and natural disaster financial planning",
      "Regional travel for on-farm consultations"
    ],
    categories: {
      primary: "Accounting Services",
      anzsicCode: "6932",
      secondary: ["Rural Business Advisory", "Tax Planning"]
    },
    tags: {
      location: ["Northern Tablelands NSW", "New England", "Armidale"],
      services: ["Primary producer specialist", "Tax planning", "Business advisory"]
    },
    industry: "professional"
  },
  {
    id: 8,
    name: "Eyre Peninsula Grain Transport",
    location: {
      town: "Port Lincoln",
      state: "SA",
      region: "Eyre Peninsula"
    },
    tagline: "Moving Eyre Peninsula's harvest - reliable transport, harvest to port.",
    description: "Family-owned grain haulage business operating modern B-double and road train fleets across Eyre Peninsula's grain belt. Specialising in harvest logistics, bin-to-port cartage, and fertiliser backhauling with GPS tracking and real-time scheduling. Supporting local growers with reliable transport solutions and competitive pricing during critical harvest periods.",
    keyFeatures: [
      "Fleet of 12 B-doubles and 8 road trains",
      "Harvest period priority scheduling system",
      "GPS tracking and real-time load updates",
      "Fertiliser and chemical backhauling services",
      "Accredited grain handling and quality protocols",
      "24/7 operations during harvest season"
    ],
    categories: {
      primary: "Road Freight Transport",
      anzsicCode: "4610",
      secondary: ["Agricultural Transport", "Grain Logistics"]
    },
    tags: {
      location: ["Eyre Peninsula SA", "Port Lincoln", "West Coast SA"],
      services: ["Grain haulage", "Harvest logistics", "B-double transport"]
    },
    industry: "transport"
  },
  {
    id: 9,
    name: "Devonport Rural Pharmacy",
    location: {
      town: "Devonport",
      state: "TAS",
      region: "North West Tasmania"
    },
    tagline: "Your local health partner - serving North West Tasmania's farming communities.",
    description: "Community pharmacy serving North West Tasmania's agricultural region with comprehensive health services including prescription medicines, veterinary supplies, and rural health consultations. Understanding the unique needs of farming families, we provide medication delivery to remote properties and stock specialised veterinary products for livestock and companion animals.",
    keyFeatures: [
      "Prescription delivery service to rural properties",
      "Veterinary medicines and livestock health products",
      "Rural health consultations and health checks",
      "Vaccination services (travel, seasonal flu, COVID-19)",
      "Medical equipment hire (mobility aids, monitoring devices)",
      "After-hours emergency prescription service"
    ],
    categories: {
      primary: "Pharmacy",
      anzsicCode: "5211",
      secondary: ["Rural Health Services", "Veterinary Supplies"]
    },
    tags: {
      location: ["North West Tasmania", "Devonport", "Cradle Coast"],
      services: ["Rural delivery", "Veterinary supplies", "Health consultations"]
    },
    industry: "health"
  },
  {
    id: 10,
    name: "Central West Agronomy Solutions",
    location: {
      town: "Dubbo",
      state: "NSW",
      region: "Central West NSW"
    },
    tagline: "Growing success through science - independent agronomy for Central West farmers.",
    description: "Independent agronomy consultancy providing crop and pasture advice across Central West NSW's diverse agricultural regions. Our qualified agronomists offer soil testing, nutrition planning, pest and disease management, and precision agriculture services. Supporting sustainable farming practices through evidence-based recommendations and ongoing monitoring for improved productivity and profitability.",
    keyFeatures: [
      "Qualified agronomists with local knowledge and experience",
      "Comprehensive soil testing and nutrition planning",
      "Precision agriculture and GPS-guided recommendations",
      "Integrated pest and disease management programs",
      "Pasture improvement and livestock nutrition advice",
      "Independence from chemical and fertiliser sales"
    ],
    categories: {
      primary: "Agricultural Consulting",
      anzsicCode: "6962",
      secondary: ["Soil Testing", "Precision Agriculture"]
    },
    tags: {
      location: ["Central West NSW", "Dubbo", "Western Plains"],
      services: ["Independent advice", "Soil testing", "Precision agriculture"]
    },
    industry: "professional"
  }
];

// Industry categories for filtering
export const industryCategories = [
  { id: 'agriculture', name: 'Agriculture', icon: '🌾' },
  { id: 'services', name: 'Services', icon: '🛠️' },
  { id: 'retail', name: 'Retail', icon: '🏪' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'tourism', name: 'Tourism', icon: '🏞️' },
  { id: 'professional', name: 'Professional Services', icon: '💼' },
  { id: 'transport', name: 'Transport', icon: '🚛' }
];

// Australian states for location filtering
export const australianStates = [
  { id: 'NSW', name: 'New South Wales' },
  { id: 'VIC', name: 'Victoria' },
  { id: 'QLD', name: 'Queensland' },
  { id: 'WA', name: 'Western Australia' },
  { id: 'SA', name: 'South Australia' },
  { id: 'TAS', name: 'Tasmania' },
  { id: 'NT', name: 'Northern Territory' },
  { id: 'ACT', name: 'Australian Capital Territory' }
];

// Extract unique regions from business data
export const regions = [...new Set(businessData.map(business => business.location.region))].sort();
