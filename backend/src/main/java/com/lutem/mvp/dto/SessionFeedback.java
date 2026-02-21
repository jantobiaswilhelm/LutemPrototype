package com.lutem.mvp.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class SessionFeedback {
    @NotNull(message = "sessionId is required")
    private Long sessionId;

    @Min(value = 1, message = "Satisfaction score must be between 1 and 5")
    @Max(value = 5, message = "Satisfaction score must be between 1 and 5")
    private int satisfactionScore;

    // Constructors
    public SessionFeedback() {}

    public SessionFeedback(Long sessionId, int satisfactionScore) {
        this.sessionId = sessionId;
        this.satisfactionScore = satisfactionScore;
    }

    // Getters and Setters
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public int getSatisfactionScore() { return satisfactionScore; }
    public void setSatisfactionScore(int satisfactionScore) {
        this.satisfactionScore = satisfactionScore;
    }
}
