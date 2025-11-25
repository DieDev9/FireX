package com.diedev.firex.dto.response;

import com.diedev.firex.enums.UserRole;

public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private UserRole role;

    public UserResponse() {}

    public UserResponse(String id, String name, String email, String phone, String address, UserRole role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.role = role;
    }

    public static UserResponseBuilder builder() {
        return new UserResponseBuilder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public static class UserResponseBuilder {
        private String id;
        private String name;
        private String email;
        private String phone;
        private String address;
        private UserRole role;

        UserResponseBuilder() {}

        public UserResponseBuilder id(String id) {
            this.id = id;
            return this;
        }

        public UserResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public UserResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserResponseBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public UserResponseBuilder address(String address) {
            this.address = address;
            return this;
        }

        public UserResponseBuilder role(UserRole role) {
            this.role = role;
            return this;
        }

        public UserResponse build() {
            return new UserResponse(id, name, email, phone, address, role);
        }
    }
}
