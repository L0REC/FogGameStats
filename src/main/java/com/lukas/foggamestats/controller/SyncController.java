package com.lukas.foggamestats.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lukas.foggamestats.model.User;
import com.lukas.foggamestats.service.SteamApiService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sync")
@RequiredArgsConstructor
public class SyncController {

	private final SteamApiService steamApiService;

	@PostMapping("/user/{steamId}")
	public ResponseEntity<User> syncUser(@PathVariable String steamId) {
		User user = steamApiService.syncUserData(steamId);
		return ResponseEntity.ok(user);
	}

}
