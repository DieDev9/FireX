package com.diedev.firex.service.impl;

import com.diedev.firex.dto.request.LoginRequest;
import com.diedev.firex.dto.request.RegisterRequest;
import com.diedev.firex.dto.response.LoginResponse;
import com.diedev.firex.dto.response.UserResponse;
import com.diedev.firex.enums.UserRole;
import com.diedev.firex.exception.BadRequestException;
import com.diedev.firex.exception.ResourceNotFoundException;
import com.diedev.firex.exception.UnauthorizedException;
import com.diedev.firex.models.AppUser;
import com.diedev.firex.repositories.UserRepository;
import com.diedev.firex.service.interfaces.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;

    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("Intento de login para: {}", request.getEmail());

        AppUser user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Credenciales incorrectas"));

        // En producción usar BCrypt para comparar passwords
        if (!user.getPassword().equals(request.getPassword())) {
            log.warn("Contraseña incorrecta para: {}", request.getEmail());
            throw new UnauthorizedException("Credenciales incorrectas");
        }

        log.info("Login exitoso para: {}", request.getEmail());

        return LoginResponse.builder()
                .success(true)
                .message("Login exitoso")
                .user(mapToUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        log.info("Intentando registrar usuario: {}", request.getEmail());

        // Validar email único
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("El email ya está registrado");
        }

        AppUser user = new AppUser();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // En producción: BCrypt.encode()
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(UserRole.USER); // Por defecto USER

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
    public UserResponse updateProfile(String id, RegisterRequest request) {
        log.info("Actualizando perfil del usuario: {}", id);

        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));

        // Validar si el email cambió y ya existe
        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("El email ya está en uso");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        // Solo actualizar password si se proporciona uno nuevo
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(request.getPassword()); // En producción: BCrypt.encode()
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

    // Helper method
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