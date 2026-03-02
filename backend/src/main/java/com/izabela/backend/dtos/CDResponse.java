package com.izabela.backend.dtos;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.izabela.backend.entities.types.Genre;
import com.izabela.backend.entities.types.MediaType;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class CDResponse {
    int id_album; 
    String title;
    String author;
    String year;
    String image_link;
    Genre genre_required;
    Genre genre_optional;
    MediaType vinyl_or_cd;
}
