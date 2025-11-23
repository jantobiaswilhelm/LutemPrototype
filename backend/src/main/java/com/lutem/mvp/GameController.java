package com.lutem.mvp;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class GameController {
    
    // In-memory storage
    private List<Game> games;
    private Map<Long, List<Integer>> feedbackMap;
    
    public GameController() {
        initializeGames();
        feedbackMap = new HashMap<>();
    }
    
    private void initializeGames() {
        games = new ArrayList<>();
        Long id = 1L;
        
        // CASUAL GAMES (5-30 min)
        
        // 1. Unpacking - Unwind, Progress Oriented
        games.add(new Game(id++, "Unpacking", 10, 20,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.PROGRESS_ORIENTED, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.MIDDAY, TimeOfDay.EVENING, TimeOfDay.LATE_NIGHT),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Puzzle", "Simulation"),
            "Zen unpacking simulator with cozy vibes",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1135690/header.jpg",
            "https://store.steampowered.com/app/1135690/Unpacking/",
            4.0 // userRating
        ));

        // 2. Dorfromantik - Unwind, Locking in
        games.add(new Game(id++, "Dorfromantik", 15, 25,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.LOCKING_IN),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Puzzle", "Strategy"),
            "Peaceful tile-placement puzzle game",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1455840/header.jpg",
            "https://store.steampowered.com/app/1455840/Dorfromantik/",
            4.0 // userRating
        ));

        // 3. Tetris Effect - Recharge, Challenge
        games.add(new Game(id++, "Tetris Effect", 5, 20,
            Arrays.asList(EmotionalGoal.RECHARGE, EmotionalGoal.CHALLENGE),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Arcade", "Puzzle"),
            "Classic Tetris with stunning audiovisuals",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1003590/header.jpg",
            "https://store.steampowered.com/app/1003590/Tetris_Effect_Connected/",
            4.0 // userRating
        ));

        // 4. Dead Cells - Challenge, Progress Oriented
        games.add(new Game(id++, "Dead Cells", 15, 25,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.MEDIUM,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Roguelike", "Action", "Platformer"),
            "Fast-paced roguelike action platformer",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/588650/header.jpg",
            "https://store.steampowered.com/app/588650/Dead_Cells/",
            4.0 // userRating
        ));

        // 5. Rocket League - Challenge, Recharge
        games.add(new Game(id++, "Rocket League", 10, 15,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.RECHARGE),
            Interruptibility.LOW,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.COMPETITIVE, SocialPreference.COOP),
            Arrays.asList("Sports", "Racing"),
            "Soccer with rocket-powered cars",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg",
            "https://store.steampowered.com/app/252950/Rocket_League/",
            4.0 // userRating
        ));

        // 6. Baba Is You - Locking in, Challenge
        games.add(new Game(id++, "Baba Is You", 15, 25,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.CHALLENGE),
            Interruptibility.HIGH,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Puzzle"),
            "Brain-teasing puzzle game with rule manipulation",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/736260/header.jpg",
            "https://store.steampowered.com/app/736260/Baba_Is_You/",
            4.0 // userRating
        ));

        // MID-RANGE GAMES (30-60 min)

        // 7. Hades - Challenge, Progress Oriented, Locking in
        games.add(new Game(id++, "Hades", 30, 45,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.PROGRESS_ORIENTED, EmotionalGoal.LOCKING_IN),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Roguelike", "Action", "RPG"),
            "Action roguelike with compelling story",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg",
            "https://store.steampowered.com/app/1145360/Hades/",
            4.0 // userRating
        ));

        // 8. Stardew Valley - Unwind, Progress Oriented, Adventure Time
        games.add(new Game(id++, "Stardew Valley", 30, 60,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.PROGRESS_ORIENTED, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COOP),
            Arrays.asList("Farming Sim", "RPG", "Simulation"),
            "Relaxing farming and life simulation",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg",
            "https://store.steampowered.com/app/413150/Stardew_Valley/",
            4.0 // userRating
        ));

        // 9. Slay the Spire - Locking in, Challenge, Progress Oriented
        games.add(new Game(id++, "Slay the Spire", 30, 60,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.CHALLENGE, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Card Game", "Roguelike", "Strategy"),
            "Strategic deck-building roguelike",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/646570/header.jpg",
            "https://store.steampowered.com/app/646570/Slay_the_Spire/",
            4.0 // userRating
        ));

        // 10. Apex Legends - Challenge, Recharge
        games.add(new Game(id++, "Apex Legends", 30, 45,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.RECHARGE),
            Interruptibility.LOW,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.COMPETITIVE, SocialPreference.COOP),
            Arrays.asList("Battle Royale", "Action"),
            "Fast-paced team-based battle royale",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg",
            "https://store.steampowered.com/app/1172470/Apex_Legends/",
            4.0 // userRating
        ));

        // 11. PowerWash Simulator - Unwind, Progress Oriented
        games.add(new Game(id++, "PowerWash Simulator", 30, 45,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.EVENING, TimeOfDay.LATE_NIGHT),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COOP),
            Arrays.asList("Simulation"),
            "Meditative cleaning simulator",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1290000/header.jpg",
            "https://store.steampowered.com/app/1290000/PowerWash_Simulator/",
            4.0 // userRating
        ));

        // 12. Into the Breach - Locking in, Challenge
        games.add(new Game(id++, "Into the Breach", 30, 50,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.CHALLENGE),
            Interruptibility.HIGH,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Strategy", "Puzzle"),
            "Turn-based tactical combat puzzle",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/590380/header.jpg",
            "https://store.steampowered.com/app/590380/Into_the_Breach/",
            4.0 // userRating
        ));

        // LONG-FORM GAMES (60+ min)

        // 13. The Witcher 3 - Adventure Time, Locking in
        games.add(new Game(id++, "The Witcher 3", 60, 120,
            Arrays.asList(EmotionalGoal.ADVENTURE_TIME, EmotionalGoal.LOCKING_IN),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("RPG", "Action", "Adventure"),
            "Epic story-driven open-world RPG",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
            "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
            4.0 // userRating
        ));

        // 14. Minecraft - Adventure Time, Unwind, Progress Oriented
        games.add(new Game(id++, "Minecraft", 60, 180,
            Arrays.asList(EmotionalGoal.ADVENTURE_TIME, EmotionalGoal.UNWIND, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.BOTH),
            Arrays.asList("Sandbox", "Survival", "Adventure"),
            "Creative building and exploration",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1366220/header.jpg",
            "https://www.minecraft.net/",
            4.0 // userRating
        ));

        // 15. Dark Souls III - Challenge, Locking in
        games.add(new Game(id++, "Dark Souls III", 60, 120,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.LOCKING_IN),
            Interruptibility.MEDIUM,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COOP),
            Arrays.asList("Action", "RPG", "Adventure"),
            "Challenging action RPG with precise combat",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg",
            "https://store.steampowered.com/app/374320/DARK_SOULS_III/",
            4.0 // userRating
        ));

        // 16. Civilization VI - Locking in, Progress Oriented
        games.add(new Game(id++, "Civilization VI", 60, 180,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.HIGH,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COMPETITIVE),
            Arrays.asList("Strategy"),
            "Turn-based historical strategy game",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg",
            "https://store.steampowered.com/app/289070/Sid_Meiers_Civilization_VI/",
            4.0 // userRating
        ));

        // 17. A Short Hike - Unwind, Adventure Time
        games.add(new Game(id++, "A Short Hike", 5, 30,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Adventure"),
            "Cozy exploration game in a beautiful park",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1055540/header.jpg",
            "https://store.steampowered.com/app/1055540/A_Short_Hike/",
            4.0 // userRating
        ));

        // 18. Loop Hero - Locking in, Progress Oriented
        games.add(new Game(id++, "Loop Hero", 30, 50,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Strategy", "Roguelike"),
            "Unique auto-battler with deck-building",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1282730/header.jpg",
            "https://store.steampowered.com/app/1282730/Loop_Hero/",
            4.0 // userRating
        ));

        // 19. Valorant - Challenge
        games.add(new Game(id++, "Valorant", 35, 50,
            Arrays.asList(EmotionalGoal.CHALLENGE),
            Interruptibility.LOW,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.COMPETITIVE, SocialPreference.COOP),
            Arrays.asList("Tactical FPS", "Action"),
            "Character-based tactical shooter",
            "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/4150c5778e7c03bdb5825519d85e5e6e8ed3a849-1920x1080.jpg",
            "https://playvalorant.com/",
            4.0 // userRating
        ));

        // 20. The Witness - Locking in, Adventure Time
        games.add(new Game(id++, "The Witness", 30, 60,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Puzzle", "Adventure"),
            "Beautiful island filled with environmental puzzles",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/210970/header.jpg",
            "https://store.steampowered.com/app/210970/The_Witness/",
            4.0 // userRating
        ));

        // === POPULAR ADDITIONS TO FILL GAPS ===

        // 21. Firewatch - Relaxing exploration
        games.add(new Game(id++, "Firewatch", 30, 45,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.EVENING, TimeOfDay.LATE_NIGHT),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Adventure"),
            "Mystery adventure in Wyoming wilderness",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/383870/header.jpg",
            "https://store.steampowered.com/app/383870/Firewatch/",
            4.0 // userRating
        ));

        // 22. It Takes Two - Co-op masterpiece
        games.add(new Game(id++, "It Takes Two", 45, 60,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.PROGRESS_ORIENTED, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.COOP),
            Arrays.asList("Co-op Adventure", "Platformer"),
            "Inventive co-op platformer with creative mechanics",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/header.jpg",
            "https://store.steampowered.com/app/1426210/It_Takes_Two/",
            4.0 // userRating
        ));

        // 23. Overcooked 2 - Chaotic cooking
        games.add(new Game(id++, "Overcooked 2", 20, 40,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.RECHARGE),
            Interruptibility.LOW,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.MIDDAY, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.COOP),
            Arrays.asList("Party Game", "Simulation"),
            "Frantic cooperative cooking under pressure",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/728880/header.jpg",
            "https://store.steampowered.com/app/728880/Overcooked_2/",
            4.0 // userRating
        ));

        // 24. Portal 2 - Puzzle perfection
        games.add(new Game(id++, "Portal 2", 30, 50,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.CHALLENGE, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.AFTERNOON, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COOP),
            Arrays.asList("Puzzle", "Adventure"),
            "Mind-bending portal puzzles with humor",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg",
            "https://store.steampowered.com/app/620/Portal_2/",
            4.0 // userRating
        ));

        // 25. Keep Talking and Nobody Explodes - Communication puzzle
        games.add(new Game(id++, "Keep Talking and Nobody Explodes", 15, 30,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.LOCKING_IN),
            Interruptibility.LOW,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.COOP),
            Arrays.asList("Puzzle"),
            "Defuse bombs through teamwork and communication",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/341800/header.jpg",
            "https://store.steampowered.com/app/341800/Keep_Talking_and_Nobody_Explodes/",
            4.0 // userRating
        ));

        // 26. Subnautica - Underwater exploration
        games.add(new Game(id++, "Subnautica", 45, 60,
            Arrays.asList(EmotionalGoal.ADVENTURE_TIME, EmotionalGoal.CHALLENGE, EmotionalGoal.LOCKING_IN),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.AFTERNOON, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Survival", "Adventure", "Horror"),
            "Underwater survival with exploration and crafting",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/264710/header.jpg",
            "https://store.steampowered.com/app/264710/Subnautica/",
            4.0 // userRating
        ));

        // 27. Risk of Rain 2 - Fast roguelike shooter
        games.add(new Game(id++, "Risk of Rain 2", 30, 45,
            Arrays.asList(EmotionalGoal.ADVENTURE_TIME, EmotionalGoal.CHALLENGE, EmotionalGoal.RECHARGE),
            Interruptibility.MEDIUM,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COOP),
            Arrays.asList("Roguelike", "Action"),
            "Third-person roguelike with intense action",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/632360/header.jpg",
            "https://store.steampowered.com/app/632360/Risk_of_Rain_2/",
            4.0 // userRating
        ));

        // 28. Ori and the Will of the Wisps - Beautiful platformer
        games.add(new Game(id++, "Ori and the Will of the Wisps", 30, 60,
            Arrays.asList(EmotionalGoal.ADVENTURE_TIME, EmotionalGoal.CHALLENGE),
            Interruptibility.MEDIUM,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.AFTERNOON, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Platformer", "Adventure"),
            "Stunning metroidvania with emotional story",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1057090/header.jpg",
            "https://store.steampowered.com/app/1057090/Ori_and_the_Will_of_the_Wisps/",
            4.0 // userRating
        ));

        // 29. Trackmania - Time trial racing
        games.add(new Game(id++, "Trackmania", 5, 15,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.RECHARGE),
            Interruptibility.HIGH,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.COMPETITIVE),
            Arrays.asList("Racing"),
            "Precision arcade racing with time trials",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/2225070/header.jpg",
            "https://www.trackmania.com/",
            4.0 // userRating
        ));

        // 30. Fall Guys - Party game chaos
        games.add(new Game(id++, "Fall Guys", 5, 10,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.RECHARGE),
            Interruptibility.LOW,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.MIDDAY, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.COMPETITIVE),
            Arrays.asList("Party Game"),
            "Colorful obstacle course battle royale",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1097150/header.jpg",
            "https://store.steampowered.com/app/1097150/Fall_Guys/",
            4.0 // userRating
        ));

        // 31. Chess Online - Classic competitive chess
        games.add(new Game(id++, "Chess Online", 5, 20,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.CHALLENGE),
            Interruptibility.HIGH,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.COMPETITIVE),
            Arrays.asList("Board Game", "Strategy"),
            "Online chess - ultimate strategy challenge",
            "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png",
            "https://www.chess.com/",
            4.0 // userRating
        ));

        // 32. Gris - Emotional art piece
        games.add(new Game(id++, "Gris", 30, 45,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.EVENING, TimeOfDay.LATE_NIGHT),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Platformer", "Adventure"),
            "Serene journey through a fading world",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/683320/header.jpg",
            "https://store.steampowered.com/app/683320/GRIS/",
            4.0 // userRating
        ));

        // 33. Spiritfarer - Cozy management adventure
        games.add(new Game(id++, "Spiritfarer", 45, 60,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.PROGRESS_ORIENTED, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COOP),
            Arrays.asList("Management", "Adventure", "Simulation"),
            "Comforting game about dying and letting go",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/972660/header.jpg",
            "https://store.steampowered.com/app/972660/Spiritfarer_Farewell_Edition/",
            4.0 // userRating
        ));

        // 34. Factorio - Factory building optimization
        games.add(new Game(id++, "Factorio", 60, 180,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.HIGH,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COOP),
            Arrays.asList("Strategy", "Simulation"),
            "Automate everything - factory building sim",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/427520/header.jpg",
            "https://store.steampowered.com/app/427520/Factorio/",
            4.0 // userRating
        ));

        // 35. Animal Crossing - Ultimate relaxation
        games.add(new Game(id++, "Animal Crossing", 30, 60,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.RECHARGE, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Life Sim", "Simulation"),
            "Peaceful island life with cute animals",
            "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_US/games/switch/a/animal-crossing-new-horizons-switch/hero",
            "https://www.nintendo.com/us/store/products/animal-crossing-new-horizons-switch/",
            4.0 // userRating
        ));

        // 36. Journey - Wordless exploration
        games.add(new Game(id++, "Journey", 15, 30,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.ADVENTURE_TIME, EmotionalGoal.RECHARGE),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.EVENING, TimeOfDay.LATE_NIGHT),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Adventure"),
            "Meditative journey through desert landscape",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/638230/header.jpg",
            "https://store.steampowered.com/app/638230/Journey/",
            4.0 // userRating
        ));

        // 37. Among Us - Social deduction
        games.add(new Game(id++, "Among Us", 10, 20,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.RECHARGE),
            Interruptibility.LOW,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.MIDDAY, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.COOP, SocialPreference.COMPETITIVE),
            Arrays.asList("Social Deduction", "Party Game"),
            "Find the impostor in spaceship tasks",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg",
            "https://store.steampowered.com/app/945360/Among_Us/",
            4.0 // userRating
        ));

        // 38. Hearthstone - Digital card game
        games.add(new Game(id++, "Hearthstone", 10, 25,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.CHALLENGE),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.MIDDAY, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.COMPETITIVE),
            Arrays.asList("Card Game", "Strategy"),
            "Strategic card battler with deep tactics",
            "https://bnetcmsus-a.akamaihd.net/cms/page_media/w4/W4NE08DTET8P1521577412158.jpg",
            "https://hearthstone.blizzard.com/",
            4.0 // userRating
        ));

        // 39. Vampire Survivors - Progression heaven
        games.add(new Game(id++, "Vampire Survivors", 15, 25,
            Arrays.asList(EmotionalGoal.PROGRESS_ORIENTED, EmotionalGoal.RECHARGE),
            Interruptibility.HIGH,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Action", "Roguelike"),
            "Addictive auto-battler with constant upgrades",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1794680/header.jpg",
            "https://store.steampowered.com/app/1794680/Vampire_Survivors/",
            4.0 // userRating
        ));

        // 40. Celeste - Precision platforming
        games.add(new Game(id++, "Celeste", 20, 40,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.HIGH,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.SOLO),
            Arrays.asList("Platformer"),
            "Tight platforming with touching story",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg",
            "https://store.steampowered.com/app/504230/Celeste/",
            4.0 // userRating
        ));

        // 41. Counter-Strike 2 - Competitive FPS
        games.add(new Game(id++, "Counter-Strike 2", 30, 50,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.LOCKING_IN),
            Interruptibility.LOW,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.COMPETITIVE, SocialPreference.COOP),
            Arrays.asList("Tactical FPS", "Action"),
            "Legendary tactical shooter with competitive gameplay",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
            "https://store.steampowered.com/app/730/CounterStrike_2/",
            4.0 // userRating
        ));
    }

    // GET /games
    @GetMapping("/games")
    public List<Game> getAllGames() {
        System.out.println("=================================");
        System.out.println("GET /games called!");
        System.out.println("Total games: " + games.size());
        if (!games.isEmpty()) {
            Game firstGame = games.get(0);
            System.out.println("First game: " + firstGame.getName());
            System.out.println("Has emotionalGoals? " + (firstGame.getEmotionalGoals() != null));
            System.out.println("Has energyRequired? " + (firstGame.getEnergyRequired() != null));
        }
        System.out.println("=================================");
        return games;
    }
    
    // POST /recommendations with multi-dimensional scoring
    @PostMapping("/recommendations")
    public RecommendationResponse getRecommendation(@RequestBody RecommendationRequest request) {
        // Backend validation
        List<String> validationErrors = validateRequest(request);
        if (!validationErrors.isEmpty()) {
            // Return error response (or throw exception for 400 Bad Request)
            System.out.println("❌ Validation failed: " + String.join(", ", validationErrors));
            return createValidationErrorResponse(validationErrors);
        }
        
        // Score all games
        Map<Game, ScoringResult> scoredGames = new HashMap<>();
        
        for (Game game : games) {
            ScoringResult result = scoreGame(game, request);
            if (result.score > 0) {
                scoredGames.put(game, result);
            }
        }

        // Sort by score (descending)
        List<Map.Entry<Game, ScoringResult>> rankedGames = scoredGames.entrySet().stream()
            .sorted(Map.Entry.<Game, ScoringResult>comparingByValue((r1, r2) -> 
                Double.compare(r2.score, r1.score)))
            .collect(Collectors.toList());

        if (rankedGames.isEmpty()) {
            return createNoMatchResponse();
        }

        // Get top 5 (1 main + 4 alternatives)
        Game topRecommendation = rankedGames.get(0).getKey();
        String topReason = rankedGames.get(0).getValue().reason;
        double topScore = rankedGames.get(0).getValue().score;
        
        List<Game> alternatives = new ArrayList<>();
        List<String> alternativeReasons = new ArrayList<>();
        List<Double> alternativeScores = new ArrayList<>();
        
        for (int i = 1; i < Math.min(5, rankedGames.size()); i++) {
            alternatives.add(rankedGames.get(i).getKey());
            alternativeReasons.add(rankedGames.get(i).getValue().reason);
            alternativeScores.add(rankedGames.get(i).getValue().score);
        }

        // Calculate match percentages
        double maxScore = topScore;
        Integer topMatchPercentage = calculateMatchPercentage(topScore, maxScore);
        
        List<Integer> alternativeMatchPercentages = new ArrayList<>();
        for (Double score : alternativeScores) {
            alternativeMatchPercentages.add(calculateMatchPercentage(score, maxScore));
        }

        return new RecommendationResponse(
            topRecommendation, alternatives, topReason, alternativeReasons,
            topMatchPercentage, alternativeMatchPercentages
        );
    }

    private ScoringResult scoreGame(Game game, RecommendationRequest request) {
        double score = 0.0;
        List<String> matchReasons = new ArrayList<>();

        // 1. TIME MATCH (30%)
        if (game.getMinMinutes() > request.getAvailableMinutes()) {
            return new ScoringResult(0.0, "Too long for available time");
        }
        
        if (game.getMaxMinutes() <= request.getAvailableMinutes()) {
            score += 30.0;
            matchReasons.add("Fits your " + request.getAvailableMinutes() + "-minute window");
        } else if (game.getMinMinutes() <= request.getAvailableMinutes()) {
            score += 20.0;
            matchReasons.add("Can start in " + request.getAvailableMinutes() + " minutes");
        }

        // 2. EMOTIONAL GOAL MATCH (25%)
        if (request.getDesiredEmotionalGoals() != null && !request.getDesiredEmotionalGoals().isEmpty()) {
            for (EmotionalGoal goal : request.getDesiredEmotionalGoals()) {
                if (game.hasEmotionalGoal(goal)) {
                    score += 25.0 / request.getDesiredEmotionalGoals().size();
                    matchReasons.add("Great for " + goal.getDisplayName().toLowerCase());
                }
            }
        }

        // 3. INTERRUPTIBILITY MATCH (20%)
        if (request.getRequiredInterruptibility() != null) {
            if (game.getInterruptibility() == request.getRequiredInterruptibility()) {
                score += 20.0;
                matchReasons.add(game.getInterruptibility().getDisplayName() + " - " + getInterruptibilityDescription(game.getInterruptibility()));
            } else if (game.getInterruptibility().ordinal() >= request.getRequiredInterruptibility().ordinal()) {
                score += 15.0;
                matchReasons.add("Easy to pause when needed");
            } else {
                score -= 10.0;
            }
        }

        // 4. ENERGY LEVEL MATCH (15%)
        if (request.getCurrentEnergyLevel() != null) {
            if (game.getEnergyRequired() == request.getCurrentEnergyLevel()) {
                score += 15.0;
                matchReasons.add("Perfect match for your " + game.getEnergyRequired().getDisplayName().toLowerCase() + " energy level");
            } else if (game.getEnergyRequired().ordinal() < request.getCurrentEnergyLevel().ordinal()) {
                score += 12.0;
                matchReasons.add("Won't drain your energy");
            } else {
                score -= 5.0;
            }
        }

        // 5. TIME OF DAY MATCH (5%)
        if (request.getTimeOfDay() != null) {
            if (game.isSuitableForTimeOfDay(request.getTimeOfDay())) {
                score += 5.0;
                matchReasons.add("Ideal for " + request.getTimeOfDay().getDisplayName().toLowerCase());
            }
        }

        // 6. SOCIAL PREFERENCE MATCH (5%)
        if (request.getSocialPreference() != null) {
            if (game.matchesSocialPreference(request.getSocialPreference())) {
                score += 5.0;
                matchReasons.add("Perfect for " + request.getSocialPreference().getDisplayName().toLowerCase() + " play");
            } else {
                score -= 5.0;
            }
        }

        // 7. SATISFACTION BONUS (max 10%)
        double avg = getAverageSatisfaction(game.getId());
        if (game.getSessionCount() > 0) {
            score += (avg / 5.0) * 10.0;
            if (avg >= 4.0) {
                matchReasons.add("You've loved this before (" + String.format("%.1f", avg) + "/5 ⭐)");
            } else if (avg >= 3.5) {
                matchReasons.add("Previously enjoyed by you");
            }
        }

        // 8. GENRE PREFERENCE BOOST (max 15%) - SOFT RANKING
        if (request.getPreferredGenres() != null && !request.getPreferredGenres().isEmpty()) {
            long genreMatches = game.getGenres().stream()
                .filter(genre -> request.getPreferredGenres().stream()
                    .anyMatch(prefGenre -> prefGenre.equalsIgnoreCase(genre)))
                .count();
            
            if (genreMatches > 0) {
                double genreBonus = (genreMatches / (double) request.getPreferredGenres().size()) * 15.0;
                score += genreBonus;
                String matchedGenres = game.getGenres().stream()
                    .filter(genre -> request.getPreferredGenres().stream()
                        .anyMatch(prefGenre -> prefGenre.equalsIgnoreCase(genre)))
                    .collect(Collectors.joining(", "));
                matchReasons.add("Matches your taste: " + matchedGenres);
            }
        }

        // Build reason summary
        String reason;
        if (matchReasons.isEmpty()) {
            reason = "Available game for your time slot";
        } else if (matchReasons.size() <= 3) {
            reason = String.join(" • ", matchReasons);
        } else {
            // Show top 3 reasons
            reason = matchReasons.subList(0, 3).stream()
                .collect(Collectors.joining(" • "));
        }
        
        return new ScoringResult(score, reason);
    }

    private String getInterruptibilityDescription(Interruptibility level) {
        switch (level) {
            case HIGH: return "pause anytime";
            case MEDIUM: return "pause at savepoints";
            case LOW: return "must complete session";
            default: return "";
        }
    }

    private RecommendationResponse createNoMatchResponse() {
        Game fallback = new Game();
        fallback.setId(0L);
        fallback.setName("No perfect match found");
        fallback.setDescription("Try adjusting your preferences");
        
        return new RecommendationResponse(fallback, new ArrayList<>(), 
            "No games match your current criteria", new ArrayList<>());
    }

    // POST /sessions/feedback
    @PostMapping("/sessions/feedback")
    public Map<String, String> submitFeedback(@RequestBody SessionFeedback feedback) {
        feedbackMap.computeIfAbsent(feedback.getGameId(), k -> new ArrayList<>())
                   .add(feedback.getSatisfactionScore());
        
        // Update game's average satisfaction
        games.stream()
            .filter(g -> g.getId().equals(feedback.getGameId()))
            .findFirst()
            .ifPresent(game -> {
                double avg = getAverageSatisfaction(game.getId());
                game.setAverageSatisfaction(avg);
                game.setSessionCount(feedbackMap.get(game.getId()).size());
            });
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Feedback recorded");
        return response;
    }

    private double getAverageSatisfaction(Long gameId) {
        List<Integer> scores = feedbackMap.get(gameId);
        if (scores == null || scores.isEmpty()) {
            return 3.0;
        }
        return scores.stream().mapToInt(Integer::intValue).average().orElse(3.0);
    }

    // Validation helper
    private List<String> validateRequest(RecommendationRequest request) {
        List<String> errors = new ArrayList<>();
        
        // 1. Validate emotional goals
        if (request.getDesiredEmotionalGoals() == null || request.getDesiredEmotionalGoals().isEmpty()) {
            errors.add("At least one emotional goal is required");
        }
        
        // 2. Validate energy level
        if (request.getCurrentEnergyLevel() == null) {
            errors.add("Energy level is required");
        }
        
        // 3. Validate available minutes (must be positive)
        if (request.getAvailableMinutes() <= 0) {
            errors.add("Available minutes must be greater than 0");
        }
        
        return errors;
    }

    private RecommendationResponse createValidationErrorResponse(List<String> errors) {
        Game errorGame = new Game();
        errorGame.setId(-1L);
        errorGame.setName("❌ Validation Error");
        errorGame.setDescription(String.join("\n• ", errors));
        
        return new RecommendationResponse(
            errorGame, 
            new ArrayList<>(), 
            "Please fill in all required fields: " + String.join(", ", errors), 
            new ArrayList<>()
        );
    }

    private Integer calculateMatchPercentage(double score, double maxScore) {
        if (maxScore == 0) {
            return 0;
        }
        // Calculate percentage: normalize score to 0-100 range
        // Maximum possible score is around 115 (30+25+20+15+5+5+10+15 with perfect matches)
        double normalizedScore = (score / 115.0) * 100.0;
        // Ensure it's between 0 and 100
        return Math.max(0, Math.min(100, (int) Math.round(normalizedScore)));
    }

    // Helper class for scoring
    private static class ScoringResult {
        double score;
        String reason;

        ScoringResult(double score, String reason) {
            this.score = score;
            this.reason = reason;
        }
    }
}
