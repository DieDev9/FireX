package com.diedev.firex.service.impl;

import com.diedev.firex.dto.request.LoginRequest;
import com.diedev.firex.dto.request.RegisterRequest;
import com.diedev.firex.dto.request.UpdateProfileRequest;
import com.diedev.firex.dto.response.LoginResponse;
import com.diedev.firex.dto.response.UserResponse;
import com.diedev.firex.enums.UserRole;
import com.diedev.firex.exception.BadRequestException;
import com.diedev.firex.exception.ResourceNotFoundException;
import com.diedev.firex.exception.UnauthorizedException;
import com.diedev.firex.models.AppUser;
import com.diedev.firex.repositories.UserRepository;
import com.diedev.firex.service.interfaces.IUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserServiceImpl implements IUserService {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final com.diedev.firex.security.JwtService jwtService;
    private final org.springframework.security.authentication.AuthenticationManager authenticationManager;

    public UserServiceImpl(UserRepository userRepository,
                           com.diedev.firex.security.JwtService jwtService,
                           org.springframework.security.authentication.AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("Intento de login para: {}", request.getEmail());

        AppUser user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Credenciales incorrectas"));

        authenticationManager.authenticate(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var jwtToken = jwtService.generateToken(user);

        log.info("Login exitoso para: {}", request.getEmail());

        return LoginResponse.builder()
                .success(true)
                .message("Login exitoso")
                .token(jwtToken)
                .user(mapToUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        log.info("Intentando registrar usuario: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("El email ya está registrado");
        }

        AppUser user = new AppUser();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(UserRole.USER);

        AppUser savedUser = userRepository.save(user);
        log.info("Usuario registrado exitosamente: {}", savedUser.getEmail());

        return mapToUserResponse(savedUser);
    }

    @Override
    public UserResponse getUserById(String id) {
        log.debug("Buscando usuario por ID: {}", id);

        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));

        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(String id, UpdateProfileRequest request) {
        log.info("Actualizando perfil del usuario: {}", id);
        log.debug("Datos recibidos - Name: {}, Phone: {}, Address: {}",
                request.getName(),
                request.getPhone(),
                request.getAddress());

        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));

        log.debug("Usuario encontrado: {} ({})", user.getName(), user.getEmail());

        boolean updated = false;

        // Name siempre se actualiza (es requerido)
        if (!request.getName().equals(user.getName())) {
            log.info("  Actualizando nombre: {} → {}", user.getName(), request.getName());
            user.setName(request.getName().trim());
            updated = true;
        }

        // Phone es opcional
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            if (!request.getPhone().equals(user.getPhone())) {
                log.info("  Actualizando teléfono: {} → {}", user.getPhone(), request.getPhone());
                user.setPhone(request.getPhone().trim());
                updated = true;
            }
        }

        // Address es opcional
        if (request.getAddress() != null && !request.getAddress().trim().isEmpty()) {
            if (!request.getAddress().equals(user.getAddress())) {
                log.info("  Actualizando dirección: {} → {}", user.getAddress(), request.getAddress());
                user.setAddress(request.getAddress().trim());
                updated = true;
            }
        }

        // Password es opcional
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            log.info("  Actualizando contraseña");
            user.setPassword(request.getPassword());
            updated = true;
        }

        if (!updated) {
            log.info("  Sin cambios detectados en el perfil");
            return mapToUserResponse(user);
        }

        AppUser updatedUser = userRepository.save(user);
        log.info("Perfil actualizado exitosamente: {}", updatedUser.getEmail());

        return mapToUserResponse(updatedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        log.debug("Obteniendo todos los usuarios");

        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteUser(String id) {
        log.info("Eliminando usuario: {}", id);

        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario", "id", id);
        }

        userRepository.deleteById(id);
        log.info("Usuario eliminado exitosamente: {}", id);
    }

    @Override
    public long countUsersByRole(String role) {
        try {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            return userRepository.countByRole(userRole);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Rol inválido: " + role);
        }
    }

    private UserResponse mapToUserResponse(AppUser user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .role(user.getRole())
                .build();
    }
}