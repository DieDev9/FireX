package com.diedev.firex.dto.response;


import java.time.LocalDateTime;

public class TimelineResponse {
    private LocalDateTime timestamp;
    private String status;
    private String by;

    public TimelineResponse() {}

    public TimelineResponse(LocalDateTime timestamp, String status, String by) {
        this.timestamp = timestamp;
        this.status = status;
        this.by = by;
    }

    public static TimelineResponseBuilder builder() {
        return new TimelineResponseBuilder();
    }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getBy() { return by; }
    public void setBy(String by) { this.by = by; }

    public static class TimelineResponseBuilder {
        private LocalDateTime timestamp;
        private String status;
        private String by;

        TimelineResponseBuilder() {}

        public TimelineResponseBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public TimelineResponseBuilder status(String status) {
            this.status = status;
            return this;
        }

        public TimelineResponseBuilder by(String by) {
            this.by = by;
            return this;
        }

        public TimelineResponse build() {
            return new TimelineResponse(timestamp, status, by);
        }
    }
}