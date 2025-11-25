package com.diedev.firex.repositories;

import com.diedev.firex.models.NotificationPreferences;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationPreferencesRepository extends MongoRepository<NotificationPreferences, String> {
    
    Optional<NotificationPreferences> findByUserId(String userId);
}
