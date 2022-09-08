package com.asra.developer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AsraApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(AsraApiApplication.class, args);
	}

}
