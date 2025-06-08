export interface RegisterRequest {
  Username: string;
  Password: string;
  Roles: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  jwtToken: string;
}