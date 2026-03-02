package com.izabela.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

import com.izabela.backend.config.ApplicationConfig;


@Import(ApplicationConfig.class)
@SpringBootApplication
public class PlytotekaApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlytotekaApplication.class, args);
	}

}