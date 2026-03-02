package com.izabela.backend.entities.types;

public enum Genre {
    AMBIENT("Ambient"),
    BLUES("Blues"),
    COUNTRY("Country"),
    DANCE("Dance"),
    DISCO("Disco"),
    DISCO_POLO("Disco-polo"),
    ELECTRONIC("Electronic"),
    FUNK("Funk"),
    GOSPEL("Gospel"),
    GRUNGE("Grunge"),
    HIP_HOP("Hip-hop"),
    HOUSE("House"),
    INDIE("Indie"),
    JAZZ("Jazz"),
    K_POP("K-pop"),
    LO_FI("Lo-fi"),
    METAL("Metal"),
    MOVIE_MUSIC("Muzyka filmowa"),
    CLASSICAL("Muzyka klasyczna"),
    FOLK("Muzyka ludowa"),
    MEDIEVAL("Muzyka średniowiecza"),
    NU_METAL("Nu-metal"),
    HEAVY_METAL("Heavy-metal"),
    OPERA("Opera"),
    POP("Pop"),
    PUNK("Punk"),
    RAP("Rap"),
    R_AND_B("R&B"),
    REGGAE("Reggae"),
    ROCK("Rock"),
    ROCK_AND_ROLL("Rock & Roll"),
    SOUNDTRACK("Ścieżka dźwiękowa"),
    SOUL("Soul"),
    SKA("Ska"),
    TRAP("Trap");

    private final String displayName;

    Genre(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName; // dzięki temu JSON wyśle string np. "Rock & Roll"
    }

     public static Genre fromDisplayName(String displayName) {
        for (Genre g : values()) {
            if (g.getDisplayName().equalsIgnoreCase(displayName)) {
                return g;
            }
        }
        throw new IllegalArgumentException("Nieznany gatunek muzyczny: " + displayName);
    }

}