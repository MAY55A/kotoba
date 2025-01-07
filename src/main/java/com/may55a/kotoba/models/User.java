package com.may55a.kotoba.models;

import jakarta.persistence.*;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false, unique = true)
    private String username;

    @ToString.Exclude
    @JsonIgnore
    @Column()
    private String password;

    @Column()
    private String profilePicture;

    @Column()
    private String description;

    @Column()
    private String favourites = "";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider authProvider;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> roles = new HashSet<>();

    @Embedded
    private LearningStats learningStats;

    public void addRole(String role) {
        roles.add(role);
    }

}
