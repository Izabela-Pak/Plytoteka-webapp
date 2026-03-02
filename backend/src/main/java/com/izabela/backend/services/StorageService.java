package com.izabela.backend.services;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;

//Konfiguracja połączenia z Supabase storage
@Service
public class StorageService {
    //Wczytanie konfiguracji z application.properties
    @Value("${supabase.url}")
    private String url;

    @Value("${supabase.key}")
    private String key;

    @Value("${supabase.bucket}")
    private String bucketName;

    //instancja obiektu RestTemplate, czyli klient HTTP wbudowany w Spring Framework
    //Uproszczony HTTP client — podobny do fetch w JavaScript lub requests w Pythonie.
    private final RestTemplate restTemplate = new RestTemplate();

    //Przyjęcie pliku z żądaniami HTTP, a następnie wysyłanie go do Supabase Storage.
    public String uploadFile(MultipartFile file, int userId) throws Exception {

        //Pobranie nazwy i wyodrębnienie rozszerzenia pliku z niej
        String originalName = file.getOriginalFilename();
        String extension = "";

        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        // Generowanie własnej nazwy: [data-i-czas]_[userId].[rozszerzenie]
        String timestamp = java.time.LocalDateTime.now()
            .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));

        String customFileName = timestamp + "_" + userId + extension;



        //Tworzenie adresu, pod który wyślemy plik
         String uploadUrl = String.format(
            "%s/storage/v1/object/%s/%s",
            url,
            bucketName,
            customFileName
        );

        //Przygotowanie nagłówków HTTP
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + key);
        headers.set("Content-Type", file.getContentType());

        //Przygotowanie ciała zapytania
        HttpEntity<byte[]> request = new HttpEntity<>(file.getBytes(), headers);
        //Wysłanie żądania POST
        ResponseEntity<String> response = restTemplate.exchange(uploadUrl, HttpMethod.POST, request, String.class);

        //Jeśli upload się udał, zwracany jest link publiczny do pliku
        if (response.getStatusCode().is2xxSuccessful()) {
            return String.format("%s/storage/v1/object/public/%s/%s",
                    url, bucketName, customFileName);
        } else {
            throw new RuntimeException("Upload failed: " + response.getBody());
        }
    }

}
