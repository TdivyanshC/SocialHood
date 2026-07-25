// Single source of truth for the real client roster — shared by the homepage
// carousel (OurWork.tsx) and the /work page (WorkPageClient.tsx), which
// previously held two independently-maintained copies that drifted out of
// sync (homepage was missing Rajgharanaa). Trust Acres is featured first
// given the Real Estate/PropTech vertical push.
export interface Client {
  id: number;
  name: string;
  website: string;
  image: string;
  description: string;
}

export const CLIENTS: Client[] = [
  {
    id: 7,
    name: "Trust Acres",
    website: "https://trustacres.com",
    image: "/images/trust.jpg",
    description: "Real Estate & Property",
  },
  {
    id: 1,
    name: "KleoniVerse",
    website: "https://kleoniverse.com",
    image: "/images/kleoni.jpg",
    description: "Fashion & Lifestyle Brand",
  },
  {
    id: 9,
    name: "Rajgharanaa",
    website: "https://rajgharanaa.com/",
    image: "/images/Screenshot (276).png",
    description: "Bridal Wear & Couture",
  },
  {
    id: 2,
    name: "PaisaPriest",
    website: "https://paisapriest.com",
    image: "/images/paisa.jpg",
    description: "Financial Services",
  },
  {
    id: 3,
    name: "SRLD Enterprises",
    website: "https://yourlaptop.in",
    image: "/images/SRLD.jpg",
    description: "Tech Solutions & Services",
  },
  {
    id: 4,
    name: "Swadeshi Hind Party",
    website: "https://swadeshihindparty.in",
    image: "/images/swadeshi.jpg",
    description: "Political Organization",
  },
  {
    id: 5,
    name: "Coursary",
    website: "https://crackcuet.co.in",
    image: "/images/coursary.jpeg",
    description: "Education & Learning Platform",
  },
  {
    id: 6,
    name: "Fitness Store",
    website: "https://thelionsgym.vercel.app",
    image: "/images/fitness.jpg",
    description: "Fitness & Wellness",
  },
  {
    id: 8,
    name: "Elecment Design Fab",
    website: "https://elecmentdesignfab.com",
    image: "/images/elecment.jpg",
    description: "Interior Design & Architecture",
  },
];
