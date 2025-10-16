package com.diedev.firex.service;

import com.diedev.firex.models.AppUser;
import com.diedev.firex.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public AppUser crearUsuario(AppUser user){
        return userRepository.save(user);
    }

    public List<AppUser> obtenerUsuarios(){
        return userRepository.findAll();
    }

    public AppUser obtenerUsuariosById(Long id){
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
    }

    public AppUser actualizarUsuario(AppUser user, Long id) {
        AppUser existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        existingUser.setName(user.getName());
        existingUser.setAddress(user.getAddress());
        existingUser.setPhone(user.getPhone());
        return userRepository.save(existingUser);
    }


    public AppUser login(String email, String password) {
        Optional<AppUser> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            AppUser user = userOpt.get();
            if (user.getPassword().equals(password)) {
                return user;
            }
        }
        return null;
    }

    public void eliminarUsuario(Long id){
        userRepository.deleteById(id);
    }

}
