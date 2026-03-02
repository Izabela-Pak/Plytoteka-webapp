package com.izabela.backend.exceptions;

public class DuplicateUserException extends RuntimeException{
    public DuplicateUserException() {
        super("Użytkownik o podanym mailu już istnieje");
    }
}
