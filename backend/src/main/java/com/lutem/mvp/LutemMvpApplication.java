package com.lutem.mvp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LutemMvpApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(LutemMvpApplication.class, args);
    }
}
