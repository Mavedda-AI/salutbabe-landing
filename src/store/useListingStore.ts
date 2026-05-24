import {create} from 'zustand';

export interface ProductModel {
  id: string;
  title: string;
  price: number;
  description: string;
  imagePaths: string[];
  sellerId: string;
  isEco: boolean;
}

interface ListingState {
  listings: ProductModel[];
  savedListings: string[]; // IDs
  addListing: (product: ProductModel) => void;
  toggleSaved: (id: string) => void;
}

export const useListingStore = create<ListingState>((set) => ({
  listings: [],
  savedListings: [],
  addListing: (product) => set((state) => ({
    listings: [product, ...state.listings]
  })),
  toggleSaved: (id) => set((state) => ({
    savedListings: state.savedListings.includes(id) 
      ? state.savedListings.filter(savedId => savedId !== id)
      : [...state.savedListings, id]
  })),
}));
