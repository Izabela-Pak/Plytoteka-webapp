package com.izabela.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.izabela.backend.entities.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByEmail(String email);
    Optional<User> findByEmailIgnoreCase(String email);
}