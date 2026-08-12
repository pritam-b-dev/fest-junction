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
  organizer?: {
    id: string;
    name: string;
    email: string;
  };
  startDate: string;
  endDate?: string;
  price: number;
  capacity: number;
  bookedSeats?: number;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED";
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  event: EventItem;
  seats: number;
  totalPrice: number;
  status: BookingStatus;
  hasReview?: boolean;
  createdAt: string;
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
