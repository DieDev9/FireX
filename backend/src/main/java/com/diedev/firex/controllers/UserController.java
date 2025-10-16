package com.diedev.firex.controllers;

import com.diedev.firex.models.AppUser;
import com.diedev.firex.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public ResponseEntity<AppUser> crearUsuario(@RequestBody AppUser user){
        AppUser newUser = userService.crearUsuario(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @GetMapping("/all")
    public ResponseEntity<List<AppUser>> obtenerTodos(){
        List<AppUser> users = userService.obtenerUsuarios();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppUser> obtenerById(@PathVariable Long id){
        AppUser user = userService.obtenerUsuariosById(id);
        return ResponseEntity.ok(user);
    }

    // Edpoint para actualizar el perfil del usuario
    @PutMapping("/perfil/{id}")
    public ResponseEntity<AppUser> actualizarPerfil(@PathVariable Long id, @RequestBody AppUser user) {
        AppUser updateProfile = userService.obtenerUsuariosById(id);
        return ResponseEntity.ok(updateProfile);

    }
    @PutMapping("/update/{id}")
    public ResponseEntity<AppUser> actualizarUser(@PathVariable Long id, @RequestBody AppUser user){
        AppUser updateUser = userService.actualizarUsuario(user, id);
        return ResponseEntity.ok(updateUser);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> eliminarUser(@PathVariable long id){
        userService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Map<String, Object> response = new HashMap<>();

        try {
            AppUser user = userService.login(email, password);

            if (user != null) {
                response.put("success", true);
                response.put("message", "Login exitoso");
                response.put("user", user);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Email o contraseña incorrectos");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error en el servidor");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
