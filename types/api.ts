import { Category } from './category';
import { Product } from './product';
import { Promotion } from './promotion';
import { Order } from './order';
import { User } from './user';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
}

export interface CategoriesResponse extends ApiResponse<Category[]> {}
export interface CategoryResponse extends ApiResponse<Category> {}

export interface ProductsResponse extends ApiResponse<Product[]> {}
export interface ProductResponse extends ApiResponse<Product> {}

export interface PromotionsResponse extends ApiResponse<Promotion[]> {}
export interface PromotionResponse extends ApiResponse<Promotion> {}

export interface OrdersResponse extends ApiResponse<Order[]> {}
export interface OrderResponse extends ApiResponse<Order> {}

export interface UserResponse extends ApiResponse<User> {}

export interface ErrorResponse {
  success: false;
  error: string;
  status: number;
} 