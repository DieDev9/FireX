package com.diedev.firex.service.interfaces;

import com.diedev.firex.dto.request.LoginRequest;
import com.diedev.firex.dto.request.RegisterRequest;
import com.diedev.firex.dto.request.UpdateProfileRequest;
import com.diedev.firex.dto.response.LoginResponse;
import com.diedev.firex.dto.response.UserResponse;

import java.util.List;

public interface IUserService {
    LoginResponse login(LoginRequest request);
    UserResponse register(RegisterRequest request);
    UserResponse getUserById(String id);
    UserResponse updateProfile(String id, UpdateProfileRequest request);
    List<UserResponse> getAllUsers();
    void deleteUser(String id);
    long countUsersByRole(String role);
}