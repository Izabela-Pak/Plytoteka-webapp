package com.izabela.backend.config;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import com.izabela.backend.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;

//dziedziczy po OncePerRequestFilter, czyli jest wywoływany raz na każde żądanie HTTP,pozwala sprawdzić np. nagłówki, tokeny
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    //Konstruktor
    public JwtAuthenticationFilter(
        JwtService jwtService, 
        HandlerExceptionResolver handlerExceptionResolver, 
        UserDetailsService userDetailsService
    ){
        this.jwtService = jwtService;
        this.handlerExceptionResolver = handlerExceptionResolver;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException{
        
        // przepuszczamy preflight OPTIONS bez tokenu
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // ignorujemy endpointy publiczne
        String path = request.getRequestURI();
        if(path.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        //Sprawdza, czy nagłówek istnieje i zaczyna się od Bearer
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            //Jeśli nie przepuszcza żądanie dalej bez autoryzacji
            filterChain.doFilter(request, response);
            return ;
        }

        try{
            //Wyciągnięcie tokena i emaila z JWT
            final String jwt = authHeader.substring(7);
            final String email = jwtService.extractUsername(jwt);

            //Sprawdzenie, czy użytkownik już nie jest zalogowany
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if(email != null && authentication == null){
                //Załadowanie użytkownika i sprawdzenie tokena
                //Jeśli JWT jest poprawny, użytkownik zostaje „zalogowany” w kontekście bezpieczeństwa aplikacji
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);
                if(jwtService.isTokenValid(jwt, userDetails)){
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            //Przepuszczenie żądania dalej
            filterChain.doFilter(request, response);
        }catch(Exception e){
            handlerExceptionResolver.resolveException(request, response, null, e);
        }
    }

}
