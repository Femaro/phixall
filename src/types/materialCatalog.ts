export interface MaterialCatalogItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  defaultUnit?: string;
  estimatedCostRange?: {
    min: number;
    max: number;
  };
  photoUrl?: string;
  isActive: boolean;
  createdAt: Date | { seconds: number; nanoseconds: number } | { toDate: () => Date };
  updatedAt?: Date | { seconds: number; nanoseconds: number } | { toDate: () => Date };
  createdBy?: string; // Admin user ID
}

