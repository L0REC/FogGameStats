package com.lukas.foggamestats.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lukas.foggamestats.model.PlaytimeRecord;
import com.lukas.foggamestats.model.User;
import com.lukas.foggamestats.service.PlaytimeRecordService;
import com.lukas.foggamestats.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/playtime")
@RequiredArgsConstructor
public class PlaytimeRecordController {

	private final PlaytimeRecordService playtimeRecordService;
	private final UserService userService;

	@GetMapping("/user/{steamId}")
	public ResponseEntity<List<PlaytimeRecord>> getRecordsByUser(@PathVariable String steamId) {
		Optional<User> user = userService.findUserBySteamId(steamId);

		if (user.isPresent()) {
			List<PlaytimeRecord> playtime = playtimeRecordService.getRecordsByUser(user.get());
			return ResponseEntity.ok(playtime);
		} else {
			return ResponseEntity.notFound().build();
		}
	}
	
	@GetMapping("/user/{steamId}/game/{gameId}")
	public ResponseEntity<PlaytimeRecord> getPlaytimeForGame(
			@PathVariable String steamId,
			@PathVariable UUID gameId
	)  {
		Optional<PlaytimeRecord> record = playtimeRecordService.getPlaytimeFromUserAndGame(steamId, gameId);
		return record.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<PlaytimeRecord> addRecord(@RequestBody @Valid PlaytimeRecord playtimeRecord, Errors errors) {
		if (errors.hasErrors()) {
			return ResponseEntity.badRequest().build();
		}

		PlaytimeRecord saved = playtimeRecordService.saveRecord(playtimeRecord);
		return ResponseEntity.ok(saved);
	}
}
