package com.izabela.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyUserRequest {
    private String email;
    private String verificationCode;
}
