import { Types } from "mongoose";
import { LeatherProductDocument } from "@/types/types";

export const vachettaProducts: Partial<LeatherProductDocument>[] = [
  {
    _id: new Types.ObjectId("676000000000000000000001"),
    name: "Artisanal Leather Briefcase",
    description: "A sophisticated handcrafted briefcase made from premium Italian leather. Perfect for professionals who appreciate timeless elegance and superior craftsmanship. Features multiple compartments for organization and a removable shoulder strap.",
    category: "bags",
    subcategory: "briefcases",
    basePrice: 450,
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3",
        publicId: "briefcase_main",
        alt: "Premium leather briefcase - main view"
      },
      {
        url: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3",
        publicId: "briefcase_detail",
        alt: "Briefcase leather detail and stitching"
      }
    ],
    videos: [],
    customizationOptions: [
      {
        type: "leather_type",
        name: "Italian Vegetable Tanned",
        value: "italian_veg_tan",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "leather_type",
        name: "Premium Full Grain",
        value: "full_grain",
        priceAdjustment: 75,
        available: true
      },
      {
        type: "thread_color",
        name: "Classic Tan",
        value: "tan",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "thread_color",
        name: "Midnight Black",
        value: "black",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "hardware_finish",
        name: "Antique Brass",
        value: "antique_brass",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "hardware_finish",
        name: "Polished Silver",
        value: "silver",
        priceAdjustment: 25,
        available: true
      },
      {
        type: "monogram",
        name: "Custom Monogram",
        value: "custom_text",
        priceAdjustment: 35,
        available: true
      }
    ],
    specifications: {
      dimensions: {
        length: 40,
        width: 30,
        height: 10,
        unit: "cm"
      },
      weight: {
        value: 1200,
        unit: "g"
      },
      materials: ["Italian Leather", "Brass Hardware", "Cotton Lining"]
    },
    craftingTime: 14,
    stockQuantity: 8,
    isCustomizable: true,
    isActive: true,
    tags: ["professional", "handcrafted", "luxury", "business"],
    reviews: [],
    averageRating: 0,
    totalReviews: 0
  },
  {
    _id: new Types.ObjectId("676000000000000000000002"),
    name: "Handcrafted Leather Wallet",
    description: "A minimalist bi-fold wallet crafted from supple leather. Features card slots, a bill compartment, and optional coin pocket. The perfect blend of functionality and style for everyday carry.",
    category: "wallets",
    subcategory: "bi-fold",
    basePrice: 85,
    images: [
      {
        url: "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3",
        publicId: "wallet_main",
        alt: "Handcrafted leather wallet - front view"
      },
      {
        url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3",
        publicId: "wallet_open",
        alt: "Wallet interior showing card slots"
      }
    ],
    videos: [],
    customizationOptions: [
      {
        type: "leather_type",
        name: "Classic Brown",
        value: "classic_brown",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "leather_type",
        name: "Vintage Black",
        value: "vintage_black",
        priceAdjustment: 10,
        available: true
      },
      {
        type: "thread_color",
        name: "Matching Thread",
        value: "matching",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "thread_color",
        name: "Contrasting Cream",
        value: "cream",
        priceAdjustment: 5,
        available: true
      },
      {
        type: "monogram",
        name: "Embossed Initials",
        value: "embossed_initials",
        priceAdjustment: 15,
        available: true
      }
    ],
    specifications: {
      dimensions: {
        length: 11,
        width: 9,
        height: 2,
        unit: "cm"
      },
      weight: {
        value: 80,
        unit: "g"
      },
      materials: ["Premium Leather", "Polyester Thread"]
    },
    craftingTime: 5,
    stockQuantity: 25,
    isCustomizable: true,
    isActive: true,
    tags: ["minimalist", "everyday", "functional", "classic"],
    reviews: [],
    averageRating: 0,
    totalReviews: 0
  },
  {
    _id: new Types.ObjectId("676000000000000000000003"),
    name: "Artisan Leather Belt",
    description: "A sturdy full-grain leather belt with hand-stitched edges. Available in multiple widths and buckle styles. Built to last a lifetime with proper care and develops a beautiful patina with age.",
    category: "belts",
    subcategory: "dress",
    basePrice: 120,
    images: [
      {
        url: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?ixlib=rb-4.0.3",
        publicId: "belt_main",
        alt: "Full grain leather belt with brass buckle"
      }
    ],
    videos: [],
    customizationOptions: [
      {
        type: "leather_type",
        name: "Cognac Leather",
        value: "cognac",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "leather_type",
        name: "Dark Chocolate",
        value: "dark_chocolate",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "hardware_finish",
        name: "Solid Brass",
        value: "brass",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "hardware_finish",
        name: "Stainless Steel",
        value: "steel",
        priceAdjustment: 15,
        available: true
      }
    ],
    specifications: {
      dimensions: {
        length: 120,
        width: 3.5,
        height: 0.4,
        unit: "cm"
      },
      weight: {
        value: 200,
        unit: "g"
      },
      materials: ["Full Grain Leather", "Metal Buckle"]
    },
    craftingTime: 7,
    stockQuantity: 15,
    isCustomizable: true,
    isActive: true,
    tags: ["durable", "classic", "formal", "handstitched"],
    reviews: [],
    averageRating: 0,
    totalReviews: 0
  },
  {
    _id: new Types.ObjectId("676000000000000000000004"),
    name: "Vintage Messenger Bag",
    description: "A spacious messenger bag inspired by vintage postal bags. Features adjustable strap, magnetic closures, and interior pockets for laptops and documents. Perfect for students and creative professionals.",
    category: "bags",
    subcategory: "messenger",
    basePrice: 320,
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3",
        publicId: "messenger_main",
        alt: "Vintage style leather messenger bag"
      }
    ],
    videos: [],
    customizationOptions: [
      {
        type: "leather_type",
        name: "Distressed Brown",
        value: "distressed_brown",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "leather_type",
        name: "Vintage Tan",
        value: "vintage_tan",
        priceAdjustment: 25,
        available: true
      },
      {
        type: "thread_color",
        name: "Heavy Duty Tan",
        value: "tan_heavy",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "hardware_finish",
        name: "Aged Brass",
        value: "aged_brass",
        priceAdjustment: 0,
        available: true
      }
    ],
    specifications: {
      dimensions: {
        length: 38,
        width: 28,
        height: 12,
        unit: "cm"
      },
      weight: {
        value: 900,
        unit: "g"
      },
      materials: ["Vintage Leather", "Canvas Lining", "Brass Hardware"]
    },
    craftingTime: 10,
    stockQuantity: 12,
    isCustomizable: true,
    isActive: true,
    tags: ["vintage", "spacious", "laptop-friendly", "casual"],
    reviews: [],
    averageRating: 0,
    totalReviews: 0
  },
  {
    _id: new Types.ObjectId("676000000000000000000005"),
    name: "Leather Card Holder",
    description: "A slim and elegant card holder perfect for minimalists. Holds 4-6 cards comfortably while maintaining a sleek profile. Available in various leather types and colors.",
    category: "wallets",
    subcategory: "card-holder",
    basePrice: 45,
    images: [
      {
        url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3",
        publicId: "cardholder_main",
        alt: "Minimalist leather card holder"
      }
    ],
    videos: [],
    customizationOptions: [
      {
        type: "leather_type",
        name: "Smooth Black",
        value: "smooth_black",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "leather_type",
        name: "Natural Tan",
        value: "natural_tan",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "monogram",
        name: "Foil Stamped Logo",
        value: "foil_stamp",
        priceAdjustment: 20,
        available: true
      }
    ],
    specifications: {
      dimensions: {
        length: 10,
        width: 7,
        height: 0.8,
        unit: "cm"
      },
      weight: {
        value: 25,
        unit: "g"
      },
      materials: ["Premium Leather"]
    },
    craftingTime: 3,
    stockQuantity: 30,
    isCustomizable: true,
    isActive: true,
    tags: ["minimal", "slim", "essential", "modern"],
    reviews: [],
    averageRating: 0,
    totalReviews: 0
  },
  {
    _id: new Types.ObjectId("676000000000000000000006"),
    name: "Leather Watch Strap",
    description: "Premium leather watch straps handcrafted to fit standard watch lugs. Available in multiple widths and leather types. Features quick-release pins for easy installation.",
    category: "accessories",
    subcategory: "watch-straps",
    basePrice: 55,
    images: [
      {
        url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3",
        publicId: "watchstrap_main",
        alt: "Handcrafted leather watch strap"
      }
    ],
    videos: [],
    customizationOptions: [
      {
        type: "leather_type",
        name: "Crocodile Embossed",
        value: "croco_embossed",
        priceAdjustment: 15,
        available: true
      },
      {
        type: "leather_type",
        name: "Smooth Calf",
        value: "smooth_calf",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "thread_color",
        name: "Matching",
        value: "matching",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "thread_color",
        name: "Contrasting White",
        value: "white",
        priceAdjustment: 5,
        available: true
      }
    ],
    specifications: {
      dimensions: {
        length: 12,
        width: 2,
        height: 0.3,
        unit: "cm"
      },
      weight: {
        value: 15,
        unit: "g"
      },
      materials: ["Premium Leather", "Stainless Steel Pins"]
    },
    craftingTime: 2,
    stockQuantity: 40,
    isCustomizable: true,
    isActive: true,
    tags: ["accessory", "elegant", "customizable", "premium"],
    reviews: [],
    averageRating: 0,
    totalReviews: 0
  },
  {
    _id: new Types.ObjectId("676000000000000000000007"),
    name: "Artisan Leather Tote",
    description: "A spacious and elegant tote bag perfect for daily use. Features reinforced handles, interior pockets, and a zippered closure. Ideal for work, shopping, or travel.",
    category: "bags",
    subcategory: "tote",
    basePrice: 280,
    images: [
      {
        url: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3",
        publicId: "tote_main",
        alt: "Elegant leather tote bag"
      }
    ],
    videos: [],
    customizationOptions: [
      {
        type: "leather_type",
        name: "Soft Pebbled",
        value: "soft_pebbled",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "leather_type",
        name: "Saffiano Finish",
        value: "saffiano",
        priceAdjustment: 50,
        available: true
      },
      {
        type: "thread_color",
        name: "Tonal Stitching",
        value: "tonal",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "hardware_finish",
        name: "Gold Tone",
        value: "gold",
        priceAdjustment: 30,
        available: true
      }
    ],
    specifications: {
      dimensions: {
        length: 35,
        width: 32,
        height: 15,
        unit: "cm"
      },
      weight: {
        value: 700,
        unit: "g"
      },
      materials: ["Premium Leather", "Fabric Lining", "Metal Hardware"]
    },
    craftingTime: 8,
    stockQuantity: 10,
    isCustomizable: true,
    isActive: true,
    tags: ["spacious", "elegant", "daily-use", "versatile"],
    reviews: [],
    averageRating: 0,
    totalReviews: 0
  },
  {
    _id: new Types.ObjectId("676000000000000000000008"),
    name: "Custom Leather Journal Cover",
    description: "A personalized leather cover for your favorite journal or notebook. Features pen holder, card slots, and custom embossing options. Perfect for writers, artists, and professionals.",
    category: "accessories",
    subcategory: "journal-covers",
    basePrice: 75,
    images: [
      {
        url: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?ixlib=rb-4.0.3",
        publicId: "journal_main",
        alt: "Leather journal cover with embossing"
      }
    ],
    videos: [],
    customizationOptions: [
      {
        type: "leather_type",
        name: "Rustic Brown",
        value: "rustic_brown",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "leather_type",
        name: "Classic Black",
        value: "classic_black",
        priceAdjustment: 0,
        available: true
      },
      {
        type: "monogram",
        name: "Name Embossing",
        value: "name_emboss",
        priceAdjustment: 25,
        available: true
      },
      {
        type: "monogram",
        name: "Logo Embossing",
        value: "logo_emboss",
        priceAdjustment: 40,
        available: true
      }
    ],
    specifications: {
      dimensions: {
        length: 21,
        width: 14,
        height: 2,
        unit: "cm"
      },
      weight: {
        value: 150,
        unit: "g"
      },
      materials: ["Genuine Leather", "Elastic Closure"]
    },
    craftingTime: 5,
    stockQuantity: 20,
    isCustomizable: true,
    isActive: true,
    tags: ["personalized", "professional", "creative", "functional"],
    reviews: [],
    averageRating: 0,
    totalReviews: 0
  }
];
