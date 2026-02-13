// ============================================
// ENUMS
// ============================================

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
}

export enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

// ============================================
// BASE TYPES
// ============================================
export type EntityId = string;

export interface BaseEntity {
  id: EntityId;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// ============================================
// API RESPONSE TYPES
// ============================================

/** Standard API response wrapper for the backend */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

/** Response structure for paginated API endpoints */
export interface ApiPaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PageMeta;
  timestamp: string;
}

/** Paging meta information - pure interface equivalent of PageMetaDto */
export interface PageMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/** Paging query parameters - pure interface equivalent of PageOptionsDto */
export interface PageOptions {
  order?: SortOrder;
  page?: number;
  take?: number;
}

// ============================================
// DOMAIN MODELS
// ============================================

export interface User extends BaseEntity {
  email: string;
  name: string | null;
  role: Role;
  tickets?: Ticket[];
}

export interface Ticket extends BaseEntity {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  userId: string;
  user?: User;
  aiSummary?: string | null;
  aiSuggestedReply?: string | null;
}

// ============================================
// AUTH INTERFACES
// ============================================

export interface AuthResponse {
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

/** JWT token payload - structure created by backend and decoded by frontend */
export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  jti?: string;
  exp?: number;
  iat?: number;
}

// ============================================
// INPUT TYPES (Create/Update operations)
// ============================================

export interface CreateTicketInput {
  title: string;
  description: string;
  priority?: Priority;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
}

// ============================================
// UTILITY TYPES
// ============================================
export type UserWithoutPassword = Omit<User, 'password'>;
export type CreateUserInput = Omit<User, keyof BaseEntity>;
export type UpdateUserInput = Partial<CreateUserInput>;
