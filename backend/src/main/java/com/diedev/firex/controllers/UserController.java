package com.diedev.firex.controllers;

import com.diedev.firex.dto.request.LoginRequest;
import com.diedev.firex.dto.request.RegisterRequest;
import com.diedev.firex.dto.response.ApiResponse;
import com.diedev.firex.dto.response.LoginResponse;
import com.diedev.firex.dto.response.UserResponse;
import com.diedev.firex.service.interfaces.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestión de usuarios
 * Base URL: /api/users
 */
@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    /**
     * POST /api/users/login
     * Autenticar usuario
     *
     * @param request Credenciales de login
     * @return LoginResponse con datos del usuario (sin password)
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("POST /api/users/login - Email: {}", request.getEmail());

        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/users/register
     * Registrar nuevo usuario
     *
     * @param request Datos del nuevo usuario
     * @return Usuario creado
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /api/users/register - Email: {}", request.getEmail());

        UserResponse user = userService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Usuario registrado exitosamente", user));
    }

    /**
     * GET /api/users/{id}
     * Obtener usuario por ID
     *
     * @param id ID del usuario
     * @return Datos del usuario
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        log.info("GET /api/users/{}", id);

        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("Usuario encontrado", user));
    }

    /**
     * PUT /api/users/profile/{id}
     * Actualizar perfil de usuario
     *
     * @param id ID del usuario
     * @param request Datos actualizados
     * @return Usuario actualizado
     */
    @PutMapping("/profile/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @PathVariable String id,
            @Valid @RequestBody RegisterRequest request) {

        log.info("PUT /api/users/profile/{}", id);

        UserResponse user = userService.updateProfile(id, request);
        return ResponseEntity.ok(ApiResponse.success("Perfil actualizado exitosamente", user));
    }

    /**
     * GET /api/users/all
     * Obtener todos los usuarios (ADMIN)
     *
     * @return Lista de usuarios
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        log.info("GET /api/users/all");

        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Usuarios obtenidos", users));
    }

    /**
     * DELETE /api/users/delete/{id}
     * Eliminar usuario (ADMIN)
     *
     * @param id ID del usuario a eliminar
     * @return Confirmación de eliminación
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        log.info("DELETE /api/users/delete/{}", id);

        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("Usuario eliminado exitosamente"));
    }
}