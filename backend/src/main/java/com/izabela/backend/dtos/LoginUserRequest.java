package com.izabela.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginUserRequest {
    private String email;
    private String password;
}
