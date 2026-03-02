package com.izabela.backend.dtos;

import lombok.Data;

@Data
public class UserInformation {
    private String email;
    private String name;

    public UserInformation(String email, String username) {
        this.email = email;
        this.name = username;
    }
}
