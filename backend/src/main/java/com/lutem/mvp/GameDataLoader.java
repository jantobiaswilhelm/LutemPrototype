package com.lutem.mvp;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lutem.mvp.model.Game;
import com.lutem.mvp.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
public class GameDataLoader implements CommandLineRunner {
    
    @Autowired
    private GameRepository gameRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Only load if database is empty
        if (gameRepository.count() == 0) {
            System.out.println("📚 Loading games from games-seed.json...");
            
            ObjectMapper mapper = new ObjectMapper();
            InputStream inputStream = new ClassPathResource("games-seed.json").getInputStream();
            
            List<Game> games = mapper.readValue(inputStream, new TypeReference<List<Game>>() {});
            
            gameRepository.saveAll(games);
            
            System.out.println("✅ Loaded " + games.size() + " games into database!");
        } else {
            System.out.println("✓ Database already contains " + gameRepository.count() + " games");
        }
    }
}
