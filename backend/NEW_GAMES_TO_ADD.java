// ADD THESE AFTER GAME #20 (The Witness) in GameController.java

        // === POPULAR ADDITIONS TO FILL GAPS ===

        // 21. Firewatch - Relaxing exploration
        games.add(new Game(id++, "Firewatch", 30, 45,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.EVENING, TimeOfDay.LATE_NIGHT),
            Arrays.asList(SocialPreference.SOLO),
            "Adventure",
            "Mystery adventure in Wyoming wilderness",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/383870/header.jpg"
        ));

        // 22. It Takes Two - Co-op masterpiece
        games.add(new Game(id++, "It Takes Two", 45, 60,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.PROGRESS_ORIENTED, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.COOP),
            "Co-op Adventure",
            "Inventive co-op platformer with creative mechanics",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/header.jpg"
        ));

        // 23. Overcooked 2 - Chaotic cooking
        games.add(new Game(id++, "Overcooked 2", 20, 40,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.RECHARGE),
            Interruptibility.LOW,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.MIDDAY, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.COOP),
            "Party Game",
            "Frantic cooperative cooking under pressure",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/728880/header.jpg"
        ));

        // 24. Portal 2 - Puzzle perfection
        games.add(new Game(id++, "Portal 2", 30, 50,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.CHALLENGE, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.AFTERNOON, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COOP),
            "Puzzle",
            "Mind-bending portal puzzles with humor",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg"
        ));
        // 25. Keep Talking and Nobody Explodes - Communication puzzle
        games.add(new Game(id++, "Keep Talking and Nobody Explodes", 15, 30,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.LOCKING_IN),
            Interruptibility.LOW,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.COOP),
            "Puzzle",
            "Defuse bombs through teamwork and communication",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/341800/header.jpg"
        ));

        // 26. Subnautica - Underwater exploration
        games.add(new Game(id++, "Subnautica", 45, 60,
            Arrays.asList(EmotionalGoal.ADVENTURE_TIME, EmotionalGoal.CHALLENGE, EmotionalGoal.LOCKING_IN),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.AFTERNOON, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO),
            "Survival",
            "Underwater survival with exploration and crafting",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/264710/header.jpg"
        ));

        // 27. Risk of Rain 2 - Fast roguelike shooter
        games.add(new Game(id++, "Risk of Rain 2", 30, 45,
            Arrays.asList(EmotionalGoal.ADVENTURE_TIME, EmotionalGoal.CHALLENGE, EmotionalGoal.RECHARGE),
            Interruptibility.MEDIUM,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COOP),
            "Roguelike",
            "Third-person roguelike with intense action",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/632360/header.jpg"
        ));

        // 28. Ori and the Will of the Wisps - Beautiful platformer
        games.add(new Game(id++, "Ori and the Will of the Wisps", 30, 60,
            Arrays.asList(EmotionalGoal.ADVENTURE_TIME, EmotionalGoal.CHALLENGE),
            Interruptibility.MEDIUM,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.AFTERNOON, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO),
            "Platformer",
            "Stunning metroidvania with emotional story",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1057090/header.jpg"
        ));
        // 29. Trackmania - Time trial racing
        games.add(new Game(id++, "Trackmania", 5, 15,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.RECHARGE),
            Interruptibility.HIGH,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.COMPETITIVE),
            "Racing",
            "Precision arcade racing with time trials",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/2225070/header.jpg"
        ));

        // 30. Fall Guys - Party game chaos
        games.add(new Game(id++, "Fall Guys", 5, 10,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.RECHARGE),
            Interruptibility.LOW,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.MIDDAY, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.COMPETITIVE),
            "Party Game",
            "Colorful obstacle course battle royale",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1097150/header.jpg"
        ));

        // 31. Chess.com - Classic competitive chess
        games.add(new Game(id++, "Chess Online", 5, 20,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.CHALLENGE),
            Interruptibility.HIGH,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.COMPETITIVE),
            "Board Game",
            "Online chess - ultimate strategy challenge",
            "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png"
        ));

        // 32. Gris - Emotional art piece
        games.add(new Game(id++, "Gris", 30, 45,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.EVENING, TimeOfDay.LATE_NIGHT),
            Arrays.asList(SocialPreference.SOLO),
            "Platformer",
            "Serene journey through a fading world",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/683320/header.jpg"
        ));
        // 33. Spiritfarer - Cozy management adventure
        games.add(new Game(id++, "Spiritfarer", 45, 60,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.PROGRESS_ORIENTED, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COOP),
            "Management",
            "Comforting game about dying and letting go",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/972660/header.jpg"
        ));

        // 34. Factorio - Factory building optimization
        games.add(new Game(id++, "Factorio", 60, 180,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.HIGH,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COOP),
            "Strategy",
            "Automate everything - factory building sim",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/427520/header.jpg"
        ));

        // === POPULAR GAMES TO FILL REMAINING GAPS ===

        // 35. Animal Crossing: New Horizons - Ultimate relaxation
        games.add(new Game(id++, "Animal Crossing", 30, 60,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.RECHARGE, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO),
            "Life Sim",
            "Peaceful island life with cute animals",
            "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_US/games/switch/a/animal-crossing-new-horizons-switch/hero"
        ));

        // 36. Journey - Wordless exploration
        games.add(new Game(id++, "Journey", 15, 30,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.ADVENTURE_TIME, EmotionalGoal.RECHARGE),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.EVENING, TimeOfDay.LATE_NIGHT),
            Arrays.asList(SocialPreference.SOLO),
            "Adventure",
            "Meditative journey through desert landscape",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/638230/header.jpg"
        ));
        // 37. Among Us - Social deduction
        games.add(new Game(id++, "Among Us", 10, 20,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.RECHARGE),
            Interruptibility.LOW,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.MIDDAY, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.COOP, SocialPreference.COMPETITIVE),
            "Social Deduction",
            "Find the impostor in spaceship tasks",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg"
        ));

        // 38. Hearthstone - Digital card game
        games.add(new Game(id++, "Hearthstone", 10, 25,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.CHALLENGE),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.MIDDAY, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.COMPETITIVE),
            "Card Game",
            "Strategic card battler with deep tactics",
            "https://bnetcmsus-a.akamaihd.net/cms/page_media/w4/W4NE08DTET8P1521577412158.jpg"
        ));

        // 39. Vampire Survivors - Progression heaven
        games.add(new Game(id++, "Vampire Survivors", 15, 25,
            Arrays.asList(EmotionalGoal.PROGRESS_ORIENTED, EmotionalGoal.RECHARGE),
            Interruptibility.HIGH,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO),
            "Action",
            "Addictive auto-battler with constant upgrades",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1794680/header.jpg"
        ));

        // 40. Celeste - Precision platforming
        games.add(new Game(id++, "Celeste", 20, 40,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.HIGH,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.SOLO),
            "Platformer",
            "Tight platforming with touching story",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg"
        ));

// END OF NEW GAMES - Total: 40 games (20 original + 20 new)
