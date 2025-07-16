// src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

interface AuthResponse {
  token: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
}

export const useSignup = () => {
  return useMutation<AuthResponse, Error, {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
  }>({
    mutationFn: (data) => 
      api.post('/auth/signup', data).then((res) => res.data),
  });
};

export const useLogin = () => {
  return useMutation<AuthResponse, Error, {
    email: string;
    password: string;
  }>({
    mutationFn: (data) => 
      api.post('/auth/login', data).then((res) => res.data),
  });
};