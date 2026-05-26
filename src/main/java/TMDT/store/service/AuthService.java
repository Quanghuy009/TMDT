package TMDT.store.service;

import TMDT.store.dto.request.LoginRequest;
import TMDT.store.dto.request.RegisterRequest;
import TMDT.store.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}