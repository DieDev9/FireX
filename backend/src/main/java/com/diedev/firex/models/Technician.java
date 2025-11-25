package com.diedev.firex.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "technicians")
public class Technician {

    @Id
    private String id;

    private String name;
    private String phone;
    private String zone;
    private List<String> specialty;
    private Boolean active = true;

    public Technician() {}

    public Technician(String id, String name, String phone, String zone, List<String> specialty, Boolean active) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.zone = zone;
        this.specialty = specialty;
        this.active = active;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public List<String> getSpecialty() { return specialty; }
    public void setSpecialty(List<String> specialty) { this.specialty = specialty; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}