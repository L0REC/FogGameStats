package com.lukas.foggamestats.dto.steam;

import java.util.List;

import lombok.Data;

@Data
public class SteamPlayerSummaryResponseDto {
	
	private List<SteamPlayerDto> players;
}
