package com.diedev.firex.dto.response;


public class LoginResponse {
    private boolean success;
    private String message;
    private String token;
    private UserResponse user;

    public LoginResponse() {}

    public LoginResponse(boolean success, String message, String token, UserResponse user) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
    }

    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }

    public static class LoginResponseBuilder {
        private boolean success;
        private String message;
        private String token;
        private UserResponse user;

        LoginResponseBuilder() {}

        public LoginResponseBuilder success(boolean success) {
            this.success = success;
            return this;
        }

        public LoginResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        public LoginResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public LoginResponseBuilder user(UserResponse user) {
            this.user = user;
            return this;
        }

        public LoginResponse build() {
            return new LoginResponse(success, message, token, user);
        }
    }
}
