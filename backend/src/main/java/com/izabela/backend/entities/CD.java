package com.izabela.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.izabela.backend.entities.types.Genre;
import com.izabela.backend.entities.types.MediaType;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "collection")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CD {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_album;

    private String author;
    private String title;
    private String year;
    @Column(length = 2048)
    private String image_link;
    @Enumerated(EnumType.STRING)
    private Genre genre_required;
    @Enumerated(EnumType.STRING)
    private Genre genre_optional;
    @Enumerated(EnumType.STRING)
    private MediaType vinyl_or_cd;


    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("collection")
    private User user;

    //Do generowania linku w bazie danych
    public String getImageLink() { 
        return image_link; 
    }

    public void setImageLink(String image_link) { 
        this.image_link = image_link; 
    }
    

}