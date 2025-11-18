package com.diedev.firex.models;

import com.diedev.firex.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AppUser {

    @Id
    private String id;

    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;

    private UserRole role;
}
