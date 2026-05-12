import { RoleName } from './Enums';

export type LoginRequest = {
    login?:     string;
    password:   string;
};

export type AuthResponse = {
    token:  string;
    id:     string;
    email:  string;
    ra:     string;
    name:   string;
    role:   RoleName;
};