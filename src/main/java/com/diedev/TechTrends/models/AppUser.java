package com.diedev.TechTrends.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users") // Nombre de la tabla en BD
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username; // o email, si lo usas para login

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // Ejemplo: "ROLE_USER", "ROLE_ADMIN"

}