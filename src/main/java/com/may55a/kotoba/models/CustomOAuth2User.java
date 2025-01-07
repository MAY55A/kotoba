package com.may55a.kotoba.models;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class CustomOAuth2User extends DefaultOAuth2User {
    private final String profilePicture;
    private final String description;
    private final LearningStats learningStats;

    public CustomOAuth2User(User user, Map<String, Object> attributes) {
        super(user.getRoles().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList()), attributes, user.getEmail());
        this.profilePicture = user.getProfilePicture();
        this.learningStats = user.getLearningStats();
        this.description = user.getDescription();
    }
}