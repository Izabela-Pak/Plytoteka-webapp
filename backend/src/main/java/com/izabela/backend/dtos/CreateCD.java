package com.izabela.backend.dtos;

import org.springframework.web.multipart.MultipartFile;

import com.izabela.backend.entities.types.Genre;
import com.izabela.backend.entities.types.MediaType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateCD {
    String title;
    String author;
    String year;
    MultipartFile file;
    String email;
    Genre genre_required;
    Genre genre_optional;
    MediaType vinyl_or_cd;
}
