package com.lukas.foggamestats.dto.steam;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class SteamPlayerDto {

	@JsonProperty("steamid")
	private String steamId;
	
	@JsonProperty("personaname")
	private String personaName;
	
	@JsonProperty("avatarfull")
	private String avatarFull;
	
	@JsonProperty("profileurl")
	private String profileUrl;
}
