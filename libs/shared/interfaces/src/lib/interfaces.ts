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

// ============================================
// UTILITY TYPES
// ============================================
export type UserWithoutPassword = Omit<User, 'password'>;
export type CreateUserInput = Omit<User, keyof BaseEntity>;
export type UpdateUserInput = Partial<CreateUserInput>;
