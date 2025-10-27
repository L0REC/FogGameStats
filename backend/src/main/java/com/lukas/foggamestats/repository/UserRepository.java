package com.lukas.foggamestats.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lukas.foggamestats.model.User;

public interface UserRepository extends JpaRepository<User, UUID> {
	Optional<User> findBySteamId(String steamId);
}
