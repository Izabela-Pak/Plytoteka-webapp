package com.izabela.backend.repositories;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.izabela.backend.entities.CD;

import org.springframework.data.jpa.repository.JpaRepository;
import com.izabela.backend.entities.User;

//Utworzenie repozytorium, przez które można zadawać zapytania bez SQL do bazy
@Repository
public interface CDRepository extends JpaRepository<CD, Integer> {
    List<CD> findAllByUser(User user);
}
