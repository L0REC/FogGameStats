package com.lukas.foggamestats.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.lukas.foggamestats.model.Game;
import com.lukas.foggamestats.model.PlaytimeRecord;
import com.lukas.foggamestats.model.User;
import com.lukas.foggamestats.repository.PlaytimeRecordRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlaytimeRecordService {
	
	private final PlaytimeRecordRepository playtimeRecordRepository;
	
	public List<PlaytimeRecord> getRecordsByUser(User user){
		return playtimeRecordRepository.findByUser(user);
	}
	
	public PlaytimeRecord saveRecord(PlaytimeRecord record) {
		return playtimeRecordRepository.save(record);
	}
	
	public Optional<PlaytimeRecord> findByUserAndGame(User user, Game game) {
		return playtimeRecordRepository.findByUserAndGame(user, game);
	}
	
	public Optional<PlaytimeRecord> getPlaytimeFromUserAndGame(String steamId, UUID gameId) {
		return playtimeRecordRepository.findByUserSteamIdAndGameId(steamId, gameId);
	}
}
