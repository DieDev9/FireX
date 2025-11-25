package com.diedev.firex.dto.response;


public class CategoryResponse {
    private String id;
    private String name;
    private String description;

    public CategoryResponse() {}

    public CategoryResponse(String id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public static CategoryResponseBuilder builder() {
        return new CategoryResponseBuilder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public static class CategoryResponseBuilder {
        private String id;
        private String name;
        private String description;

        CategoryResponseBuilder() {}

        public CategoryResponseBuilder id(String id) {
            this.id = id;
            return this;
        }

        public CategoryResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public CategoryResponseBuilder description(String description) {
            this.description = description;
            return this;
        }

        public CategoryResponse build() {
            return new CategoryResponse(id, name, description);
        }
    }
}
