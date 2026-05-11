import { User } from './user';

export type LoginRequest = {
    ra?:        string;
    email?:     string;
    password:   string;
};

export type AuthResponse = {
    token:  string;
    id:     string;
    email:  string;
    ra:     string;
    name:   string;
    role:   string;
};