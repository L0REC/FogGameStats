package com.lukas.foggamestats.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lukas.foggamestats.model.PlaytimeRecord;
import com.lukas.foggamestats.model.User;

public interface PlaytimeRecordRepository extends JpaRepository<PlaytimeRecord, UUID> {
	List<PlaytimeRecord> findByUser(User user);
}
