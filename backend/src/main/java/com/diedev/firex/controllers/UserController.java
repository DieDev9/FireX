package com.diedev.firex.controllers;

import com.diedev.firex.dto.request.LoginRequest;
import com.diedev.firex.dto.request.RegisterRequest;
import com.diedev.firex.dto.request.UpdateProfileRequest;
import com.diedev.firex.dto.response.ApiResponse;
import com.diedev.firex.dto.response.LoginResponse;
import com.diedev.firex.dto.response.UserResponse;
import com.diedev.firex.service.interfaces.IUserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestión de usuarios
 * Endpoint de actualización de perfil
 */
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final IUserService userService;

    public UserController(IUserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("POST /api/users/login - Email: {}", request.getEmail());

        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /api/users/register - Email: {}", request.getEmail());

        UserResponse user = userService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Usuario registrado exitosamente", user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        log.info("GET /api/users/{}", id);

        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("Usuario encontrado", user));
    }

    /**
     * Actualizar perfil con DTO específico
     * PUT /api/users/profile/{id}
     * Solo name es requerido, phone/address/password son opcionales
     */
    @PutMapping("/profile/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @PathVariable String id,
            @Valid @RequestBody UpdateProfileRequest request) {

        log.info("PUT /api/users/profile/{} - Name: {}", id, request.getName());

        UserResponse user = userService.updateProfile(id, request);
        return ResponseEntity.ok(ApiResponse.success("Perfil actualizado exitosamente", user));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        log.info("GET /api/users/all");

        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Usuarios obtenidos", users));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        log.info("DELETE /api/users/delete/{}", id);

        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("Usuario eliminado exitosamente"));
    }
}