package com.lukas.foggamestats.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.lukas.foggamestats.config.SteamApiConfig;
import com.lukas.foggamestats.dto.steam.SteamGameDto;
import com.lukas.foggamestats.dto.steam.SteamOwnedGamesWrapperDto;
import com.lukas.foggamestats.dto.steam.SteamPlayerDto;
import com.lukas.foggamestats.dto.steam.SteamPlayerSummaryWrapperDto;
import com.lukas.foggamestats.model.Game;
import com.lukas.foggamestats.model.PlaytimeRecord;
import com.lukas.foggamestats.model.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SteamApiService {

	private final WebClient steamWebClient;
	private final SteamApiConfig steamApiConfig;
	private final UserService userService;
	private final GameService gameService;
	private final PlaytimeRecordService playtimeRecordService;

	public SteamOwnedGamesWrapperDto fetchOwnedGames(String steamId) {

		String apiKey = steamApiConfig.getSteamApiKey();

		return steamWebClient.get()
				.uri(uriBuilder -> uriBuilder
						.path("/IPlayerService/GetOwnedGames/v0001/")
						.queryParam("key", apiKey)
						.queryParam("steamid", steamId)
						.queryParam("include_appinfo", true)
						.queryParam("include_played_free_games", true)
						.queryParam("format", "json")
						.build())
				.retrieve()
				.bodyToMono(SteamOwnedGamesWrapperDto.class)
				.block();
	}

	public SteamPlayerSummaryWrapperDto fetchPlayerSummary(String steamId) {

		String apiKey = steamApiConfig.getSteamApiKey();

		return steamWebClient.get()
				.uri(uriBuilder -> uriBuilder
						.path("/ISteamUser/GetPlayerSummaries/v0002/")
						.queryParam("key", apiKey)
						.queryParam("steamids", steamId)
						.queryParam("format", "json")
						.build())
				.retrieve()
				.bodyToMono(SteamPlayerSummaryWrapperDto.class)
				.block();
	}

	public User syncUserData(String steamId) {
		SteamPlayerSummaryWrapperDto summaryWrapper = fetchPlayerSummary(steamId);
		SteamPlayerDto steamPlayer = summaryWrapper.getResponse().getPlayers().get(0);

		User user = userService.findUserBySteamId(steamId)
				.orElse(new User());
		user.setSteamId(steamId);
		user.setUsername(steamPlayer.getPersonaName());
		user.setAvatarUrl(steamPlayer.getAvatarFull());
		user = userService.saveUser(user);

		SteamOwnedGamesWrapperDto gamesWrapper = fetchOwnedGames(steamId);
		List<SteamGameDto> steamGames = gamesWrapper.getResponse().getGames();

		for (SteamGameDto steamGame : steamGames) {

			Game game = upsertGame(steamGame);

			upsertPlaytimeRecord(user, game, steamGame.getPlaytimeForever());
		}

		return user;
	}

	private Game upsertGame(SteamGameDto steamGame) {
		Game game = gameService.findGameByAppId(steamGame.getAppId())
				.orElse(new Game());

		if (game.getAppId() == null) {
			game.setAppId(steamGame.getAppId());
		}

		game.setName(steamGame.getName());
		game.setHeaderImage(
				"https://cdn.cloudflare.steamstatic.com/steam/apps/"
						+ steamGame.getAppId() + "/header.jpg");

		return gameService.saveGame(game);
	}

	private void upsertPlaytimeRecord(User user, Game game, Integer playtimeMinutes) {
		PlaytimeRecord record = playtimeRecordService.findByUserAndGame(user, game)
				.orElse(new PlaytimeRecord());

		record.setUser(user);
		record.setGame(game);
		record.setTotalMinutesPlayed(playtimeMinutes);
		playtimeRecordService.saveRecord(record);
	}
}
