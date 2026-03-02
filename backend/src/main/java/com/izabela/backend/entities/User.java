package com.izabela.backend.entities;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Entity
@Data
@Table(name = "app_user")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails{
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @EqualsAndHashCode.Include
    @Id
    private Integer id;

    @NotNull
    @NotBlank
    @Email
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotNull
    @NotBlank
    @Size(min = 4, max = 25)
    @Column(name = "name")
    private String name;

    @NotNull
    @NotBlank
    // Przynajmniej jedna mała i duża litera oraz jedna cyfra
    @Column(name = "password")
    private String password;

    @Column(name = "role")
    private String role;

    @Column(name = "is_enabled")
    private boolean is_enabled;

    @Column(name = "verification_code")
    private String verification_code;

    @Column(name = "verification_code_expires_at")
    private LocalDateTime verification_code_expires_at;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<CD> collection;

    //Konstruktor
    public User(
        String name,
        String email,
        String password
    ){
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public void setUserRole(){
        this.role = "USER";
    }

    public void setEnabled(Boolean value){
        this.is_enabled = value;
    }

    public void setVerificationCode(String code){
        this.verification_code = code;
    }

    public String getVerificationCode(){
        return verification_code;
    }
    public LocalDateTime getVerificationCodeExpiesAt(){
        return verification_code_expires_at;
    }

    public void setVerificationCodeExpiresAt(LocalDateTime expires){
        this.verification_code_expires_at = expires;
    }

     // ---> WYMAGANE PRZEZ UserDetails
    @Override
    public String getUsername() {
        return email; // login = email
    }

    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // jeśli nie masz ról, ustaw przynajmniej jedną:
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
    }


    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.is_enabled;
    }
}