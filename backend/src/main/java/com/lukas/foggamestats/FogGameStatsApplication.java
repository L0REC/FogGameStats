package com.lukas.foggamestats;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FogGameStatsApplication {

	public static void main(String[] args) {
		SpringApplication.run(FogGameStatsApplication.class, args);
	}

}
