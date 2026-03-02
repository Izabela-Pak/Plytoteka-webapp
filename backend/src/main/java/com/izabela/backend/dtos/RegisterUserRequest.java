package com.izabela.backend.dtos;

import lombok.Data;

@Data
public class RegisterUserRequest {

    private String email;
    private String name;
    private String password;
}
