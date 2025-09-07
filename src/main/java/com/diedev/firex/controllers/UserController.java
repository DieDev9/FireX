package com.diedev.firex.controllers;

import com.diedev.firex.models.AppUser;
import com.diedev.firex.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
