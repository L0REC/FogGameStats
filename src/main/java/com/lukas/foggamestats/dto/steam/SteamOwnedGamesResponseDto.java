package com.lukas.foggamestats.dto.steam;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class SteamOwnedGamesResponseDto {

	@JsonProperty("game_count")
	private Integer gameCount;
	
	private List<SteamGameDto> games;
}
