package com.diedev.TechTrends.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {
    private String jwt;
    public AuthResponse(String jwt) { this.jwt = jwt; }
    public String getJwt() { return jwt; }
}