package com.izabela.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.izabela.backend.repositories.UserRepository;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

@Configuration
public class ApplicationConfig implements WebMvcConfigurer {

    private final UserRepository userRepository;

    public ApplicationConfig(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    //Szukanie użytkownika po mailu
    @Bean
    UserDetailsService userDetailsService(){
        return username -> userRepository.findByEmailIgnoreCase(username)
            .orElseThrow(() -> new UsernameNotFoundException("Nie znaleziono użytkownika")); 
    }

    //Do hashowania haseł
    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //kiedy użytkownik wysyła formularz logowania, Spring Security przekazuje login i hasło do AuthenticationManager, 
    //a on próbuje użyć dostępnych AuthenticationProvider do uwierzytelnienia.
    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    //autoryzacja logowania
    @Bean
    AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

}