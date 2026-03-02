package com.izabela.backend.entities.types;


public enum MediaType {
    VINYL("vinyl"),
    CD("cd");

    private final String displayName;

    MediaType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }

    public static MediaType fromDisplayName(String displayName) {
        for (MediaType g : values()) {
            if (g.getDisplayName().equalsIgnoreCase(displayName)) {
                return g;
            }
        }
        throw new IllegalArgumentException("Nieznany typ płyty : " + displayName);
    }

}
