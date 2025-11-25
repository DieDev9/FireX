package com.diedev.firex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class FirexApplication {

	public static void main(String[] args) {
		SpringApplication.run(FirexApplication.class, args);
	}

}
