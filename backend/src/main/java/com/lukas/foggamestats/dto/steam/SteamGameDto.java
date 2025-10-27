package com.lukas.foggamestats.dto.steam;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class SteamGameDto {
	
	@JsonProperty("appid")
	private Integer appId;
	
	private String name;
	
	@JsonProperty("playtime_forever")
	private Integer playtimeForever;
	
	@JsonProperty("img_icon_url")
	private String imgIconUrl;
	
	@JsonProperty("img_logo_url")
	private String imgLogoUrl;
}
