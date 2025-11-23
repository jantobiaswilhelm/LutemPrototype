package com.lutem.mvp.repository;

import com.lutem.mvp.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    // Custom query methods can be added here
    List<Game> findByNameContainingIgnoreCase(String name);
    List<Game> findByMinMinutesLessThanEqualAndMaxMinutesGreaterThanEqual(int max, int min);
}
