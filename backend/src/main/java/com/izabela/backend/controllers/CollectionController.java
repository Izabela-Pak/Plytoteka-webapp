package com.izabela.backend.controllers;

import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.izabela.backend.dtos.CDResponse;
import com.izabela.backend.entities.CD;
import com.izabela.backend.repositories.CDRepository;
import com.izabela.backend.repositories.UserRepository;
import com.izabela.backend.services.StorageService;
import com.izabela.backend.entities.User;
import com.izabela.backend.entities.types.Genre;
import com.izabela.backend.entities.types.MediaType;


@RestController
@RequestMapping("/api")
public class CollectionController {

    private final CDRepository cdRepository;
    private final StorageService storageService;
    private final UserRepository userRepository;

    public CollectionController(CDRepository cdRepository, StorageService storageService, UserRepository userRepository){
        this.cdRepository = cdRepository;
        this.storageService = storageService;
        this.userRepository = userRepository;
    }

    @GetMapping("/list")
    public List<CDResponse> getListCD(@RequestParam String email) {

        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));
        return cdRepository.findAllByUser(user)
        .stream()
        .map(cd -> new CDResponse(
            cd.getId_album(),
            cd.getTitle(),
            cd.getAuthor(),
            cd.getYear(),
            cd.getImage_link(),
            cd.getGenre_required(),
            cd.getGenre_optional(),
            cd.getVinyl_or_cd()
        ))
        .toList();
    }

    @GetMapping("/cd/{id}")
    @ResponseBody
    public CDResponse getSpecificCd(@PathVariable("id") int id_album) {
        CD cd = cdRepository.findById(id_album).orElseThrow(() -> new RuntimeException("Nie znaleziono albumu o id=" + id_album));
        return new CDResponse(
            cd.getId_album(),
            cd.getTitle(),
            cd.getAuthor(),
            cd.getYear(),
            cd.getImage_link(),
            cd.getGenre_required(),
            cd.getGenre_optional(),
            cd.getVinyl_or_cd()
        );
    }

       @PostMapping("/create")
    public CDResponse createProduct(@RequestParam String title, @RequestParam String author, @RequestParam String year, @RequestParam String email  , @RequestPart(value = "image", required = false) MultipartFile file, @RequestParam(required = false) String genre_optional, @RequestParam String genre_required, @RequestParam String cd_type) throws Exception {
        
        CD cd = new CD();
        cd.setTitle(title);
        cd.setAuthor(author);
        cd.setYear(year);
        if(genre_optional!=null && !genre_optional.isEmpty()){
            cd.setGenre_optional(Genre.fromDisplayName(genre_optional));
        }
        
        cd.setGenre_required(Genre.fromDisplayName(genre_required));
        cd.setVinyl_or_cd(MediaType.fromDisplayName(cd_type));
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        cd.setUser(user);
        
        //Jeśli użytkownik przesłał zdjęcie to wrzuca je do storage'a i generuje link
        if (file != null && !file.isEmpty()) {
            String imageUrl = storageService.uploadFile(file, user.getId());
            cd.setImageLink(imageUrl);
        }

        CD saved = cdRepository.save(cd);

        return new CDResponse(
            saved.getId_album(),
            saved.getTitle(),
            saved.getAuthor(),
            saved.getYear(),
            saved.getImageLink(),
            saved.getGenre_optional(),
            saved.getGenre_required(),
            saved.getVinyl_or_cd()
        );
        
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteAlbum(@PathVariable int id){
        return cdRepository.findById(id)
            .map(album -> {
                cdRepository.delete(album);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/modify/{id}")
    public ResponseEntity<CDResponse> modifyAlbum(@PathVariable int id, @RequestPart String title, @RequestPart String author, @RequestPart String year, @RequestPart String email  , @RequestPart(value = "image", required = false) MultipartFile image, @RequestPart(required = false) String genre_optional, @RequestPart String genre_required, @RequestPart String cd_type) throws Exception {
        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new RuntimeException("User not found"));
        return cdRepository.findById(id)
                .map(existingAlbum -> {
                    existingAlbum.setTitle(title);
                    existingAlbum.setAuthor(author);
                    existingAlbum.setYear(year);
                    existingAlbum.setUser(user);
                    existingAlbum.setGenre_required(Genre.fromDisplayName(genre_required));
                    if(genre_optional!=null && !genre_optional.isEmpty()){
                        existingAlbum.setGenre_optional(Genre.fromDisplayName(genre_optional));
                    }
                    existingAlbum.setVinyl_or_cd(MediaType.fromDisplayName(cd_type));

                    if (image != null && !image.isEmpty()) {
                        try {
                            String imageUrl = storageService.uploadFile(image, user.getId());
                            existingAlbum.setImageLink(imageUrl);
                        } catch (Exception e) {
                            throw new RuntimeException("Nie udało się wgrać zdjęcia");
                        }
                    }

                    CD saved = cdRepository.save(existingAlbum);

                    CDResponse response = new CDResponse(
                            saved.getId_album(),
                            saved.getTitle(),
                            saved.getAuthor(),
                            saved.getYear(),
                            saved.getImageLink(),
                            saved.getGenre_required(),
                            saved.getGenre_optional(),
                            saved.getVinyl_or_cd()
                    );

                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /* 
    Testowanie samego wrzucania obrazu do bazy danych
    @PostMapping("/image")
    public void createProduct(@RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        
        //Jeśli użytkownik przesłał zdjęcie to wrzuca je do storage'a i generuje link
        if (image != null && !image.isEmpty()) {
            String imageUrl = storageService.uploadFile(image);
            System.out.println(imageUrl);
        }
        
    }
    */

}

