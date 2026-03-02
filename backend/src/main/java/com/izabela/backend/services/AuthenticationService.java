package com.izabela.backend.services;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.izabela.backend.dtos.LoginUserRequest;
import com.izabela.backend.dtos.RegisterUserRequest;
import com.izabela.backend.dtos.VerifyUserRequest;
import com.izabela.backend.repositories.UserRepository;
import com.izabela.backend.entities.User;
import jakarta.mail.MessagingException;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        EmailService emailService
    ){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    public User register(RegisterUserRequest input) {
        User user = new User(
            input.getName(),
            input.getEmail(),
            passwordEncoder.encode(input.getPassword())
        );

        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(60));
        user.setEnabled(false);
        user.setUserRole();
        sendVerificationEmail(user);

        return user;
    }

    public User  authenticate(LoginUserRequest input){
        User user = userRepository.findByEmailIgnoreCase(input.getEmail())
            .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        if(!user.isEnabled()){
            throw new RuntimeException("Konto nie zostało zweryfikowane. Proszę zweryfikuj je poprzez email");
        }

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                input.getEmail(),
                input.getPassword()
            )
        );

        return user;
    }

    public void verifyUser(VerifyUserRequest input){
        Optional<User> optionalUser = userRepository.findByEmailIgnoreCase(input.getEmail());
        if(optionalUser.isPresent()){
            User user = optionalUser.get();
            if(user.getVerificationCodeExpiesAt().isBefore(LocalDateTime.now())){
                throw new RuntimeException("Kod weryfikacyjny wygasnął");
            }
            if(user.getVerificationCode().equals(input.getVerificationCode())){
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationCodeExpiresAt(null);
                userRepository.save(user);
            }else{
                throw new RuntimeException("Niewłaściwy kod weryfikacyjny");
            }
        }else{
            throw new RuntimeException("Nie znaleziono użytkownika");
        }
    }

    public void resendVerificationCode(String email){
        Optional<User> optionalUser = userRepository.findByEmailIgnoreCase(email);
        if(optionalUser.isPresent()){
            User user = optionalUser.get();
            if(user.isEnabled()){
                throw new RuntimeException("Użytkownik został już zweryfikowany");
            }
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(1));
            sendVerificationEmail(user);
            userRepository.save(user);
        }else{
            throw new RuntimeException("Nie znaleziono użytkownika");
        }
    }


    public void sendVerificationEmail(User user){
        String subject = "Account Verification";
        String verificationCode = user.getVerificationCode();
        String htmlMessage = "<html>"
            + "<body style=\"font-family: Arial, sans-serif;\">"
            + "<div style=\"background-color: #f5f5f5; padding: 20px; \">"
            + "<h3 style=\"color: #333;\">Verification Code:</h3>"
            + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff; \">" + verificationCode + "</p>"
            + "</div>"
            + "</body>"
            + "</html>";

        try{
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        }catch(MessagingException e){
            System.err.println("Error sending email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String generateVerificationCode(){
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }

}
