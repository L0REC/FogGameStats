package com.lukas.foggamestats.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lukas.foggamestats.model.Game;
import com.lukas.foggamestats.service.GameService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {

	private final GameService gameService;

	@GetMapping("/{appId}")
	public ResponseEntity<Game> getGameByAppId(@PathVariable Integer appId) {
		Optional<Game> game = gameService.findGameByAppId(appId);

		if (game.isPresent()) {
			return ResponseEntity.ok(game.get());
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping("/search")
	public ResponseEntity<List<Game>> getGameByNameContaining(@RequestParam String name) {
		List<Game> games = gameService.findGamesByNameContaining(name);
		return ResponseEntity.ok(games);
	}
	
	@GetMapping
	public ResponseEntity<List<Game>> getAllGames() {
		List<Game> games = gameService.getAllGames();
		return ResponseEntity.ok(games);
	}
}
