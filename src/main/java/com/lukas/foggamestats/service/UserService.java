package com.lukas.foggamestats.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lukas.foggamestats.model.User;
import com.lukas.foggamestats.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	
	private final UserRepository userRepository;
	
	public Optional<User> findUserBySteamId(String steamId) {
		return userRepository.findBySteamId(steamId);
	}
	
	public User saveUser(User user) {
		return userRepository.save(user);
	}
}
