package com.diedev.firex.service.interfaces;

import com.diedev.firex.dto.request.LoginRequest;
import com.diedev.firex.dto.request.RegisterRequest;
import com.diedev.firex.dto.response.LoginResponse;
import com.diedev.firex.dto.response.UserResponse;
import com.diedev.firex.models.AppUser;

import java.util.List;

public interface IUserService {
    LoginResponse login(LoginRequest request);
    UserResponse register(RegisterRequest request);
    UserResponse getUserById(String id);
    UserResponse updateProfile(String id, RegisterRequest request);
    List<UserResponse> getAllUsers();
    void deleteUser(String id);
    long countUsersByRole(String role);
}