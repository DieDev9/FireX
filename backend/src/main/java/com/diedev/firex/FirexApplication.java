package com.diedev.firex;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class FirexApplication {

	public static void main(String[] args) {
		// Cargar variables de entorno desde .env
		try {
			Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.load();
			
			dotenv.entries().forEach(entry -> {
				System.setProperty(entry.getKey(), entry.getValue());
			});
		} catch (Exception e) {
			System.out.println("No se pudo cargar el archivo .env: " + e.getMessage());
		}

		SpringApplication.run(FirexApplication.class, args);
	}

}
