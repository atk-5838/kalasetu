export type CraftCategory = 
  | 'Kasuti Embroidery' 
  | 'Beedu Craft' 
  | 'Wooden Artifact' 
  | 'Terracotta & Brass';

export interface CraftProduct {
  id: string;
  title: string;
  titleKannada?: string;
  artisanName: string;
  artisanVillage: string;
  artisanPhoto?: string;
  craftCategory: CraftCategory;
  priceINR: number;
  image: string;
  summary: string;
  fullStory: string;
  timeTaken: string;
  materialsUsed: string[];
  giCertified: boolean;
  certificateId: string;
  voiceTranscript: string;
  voiceTranscriptKannada?: string;
  voiceLanguage: 'en' | 'kn' | 'hi';
  createdDate: string;
  inStock: boolean;
}

export interface CartItem {
  product: CraftProduct;
  quantity: number;
}

export type AppLanguage = 'en' | 'kn' | 'hi';

export type ActiveView = 'buyer' | 'artisan';
