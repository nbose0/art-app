import type { Museum } from "./types";

export const museums: Museum[] = [
  {
    id: "met",
    name: "The Metropolitan Museum of Art",
    location: "New York, USA",
    coordinates: [40.7794, -73.9632],
    image: "/museums/met.svg",
    websiteUrl: "https://www.metmuseum.org",
    description:
      "One of the world's largest and finest art museums, with over 5,000 years of art from around the world.",
    apiSource: "met",
    apiParams: { departmentId: 13 }, // Greek and Roman Art (rich in sculpture)
  },
  {
    id: "artic",
    name: "Art Institute of Chicago",
    location: "Chicago, USA",
    coordinates: [41.8796, -87.6237],
    image: "/museums/artic.svg",
    websiteUrl: "https://www.artic.edu",
    description:
      "Home to a renowned collection of sculptures spanning ancient to contemporary works.",
    apiSource: "artic",
    apiParams: { q: "sculpture" },
  },
  {
    id: "artic-photo",
    name: "Art Institute — Photography",
    location: "Chicago, USA",
    coordinates: [41.8796, -87.6237],
    image: "/museums/artic-photo.svg",
    websiteUrl: "https://www.artic.edu/departments/photography-and-media",
    description:
      "A stunning collection of photography spanning from the medium's invention to the present day.",
    apiSource: "artic",
    apiParams: { q: "photograph" },
  },
  {
    id: "cleveland",
    name: "Cleveland Museum of Art",
    location: "Cleveland, USA",
    coordinates: [41.509, -81.6121],
    image: "/museums/cleveland.svg",
    websiteUrl: "https://www.clevelandart.org",
    description:
      "Free and open to the public, renowned for the quality and breadth of its collection.",
    apiSource: "cleveland",
    apiParams: { type: "Sculpture" },
  },
  {
    id: "cleveland-modern",
    name: "Cleveland — Modern Art",
    location: "Cleveland, USA",
    coordinates: [41.509, -81.6121],
    image: "/museums/cleveland-modern.svg",
    websiteUrl: "https://www.clevelandart.org",
    description:
      "A dynamic collection of modern and contemporary art challenging perspectives since the 20th century.",
    apiSource: "cleveland",
    apiParams: { type: "Sculpture", created_after: "1900" },
  },
  {
    id: "rijks",
    name: "Rijksmuseum",
    location: "Amsterdam, Netherlands",
    coordinates: [52.36, 4.8852],
    image: "/museums/rijks.svg",
    websiteUrl: "https://www.rijksmuseum.nl",
    description:
      "The national museum of the Netherlands, home to masterpieces by Rembrandt, Vermeer, and more.",
    apiSource: "rijks",
    apiParams: { rijksType: "sculpture" },
  },
  {
    id: "rijks-landscape",
    name: "Rijksmuseum — Landscapes",
    location: "Amsterdam, Netherlands",
    coordinates: [52.36, 4.8852],
    image: "/museums/rijks-landscape.svg",
    websiteUrl: "https://www.rijksmuseum.nl",
    description:
      "Dutch Golden Age landscapes capturing the beauty of light, sky, and terrain.",
    apiSource: "rijks",
    apiParams: { rijksType: "painting", description: "landscape" },
  },
];
