package com.lukas.foggamestats.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lukas.foggamestats.model.Game;

public interface GameRepository extends JpaRepository<Game, UUID> {
	Optional<Game> findByAppId(Integer appId);
	List<Game> findByNameContaining(String name);
}
