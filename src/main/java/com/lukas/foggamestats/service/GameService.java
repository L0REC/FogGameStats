package com.lukas.foggamestats.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lukas.foggamestats.model.Game;
import com.lukas.foggamestats.repository.GameRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameService {
	
	private final GameRepository gameRepository;
	
	public Optional<Game> findGameByAppId(Integer appId) {
		return gameRepository.findByAppId(appId);
	}
	
	public List<Game> findGamesByNameContaining(String name) {
		return gameRepository.findByNameContaining(name);
	}
}
