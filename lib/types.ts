// lib/types.ts
export type UserRole = "ADMIN" | "ORGANIZER" | "ATTENDEE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  location?: string;
  category: Category;
  categoryId: string;
  organizerId: string;
  startDate: string;
  endDate?: string;
  price: number;
  capacity: number;
  bookedSeats?: number;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED";
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    averageRating?: number;
  };
}
