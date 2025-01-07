package com.may55a.kotoba.services;

import com.may55a.kotoba.models.*;
import com.may55a.kotoba.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String email, String userName, String password) throws IllegalArgumentException{
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (userRepository.existsByUsername(userName)) {
            throw new IllegalArgumentException("User name already in use");
        }

        User user = new User();
        user.setEmail(email);
        user.setUsername(userName);
        user.setPassword(passwordEncoder.encode(password));
        user.setAuthProvider(AuthProvider.LOCAL);
        user.addRole("USER");
        user.setLearningStats(new LearningStats());

        return userRepository.save(user);
    }

    public User getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = "";
        if (authentication.getPrincipal() instanceof CustomUserDetails) {
            email = ((CustomUserDetails) authentication.getPrincipal()).getEmail();
        } else if (authentication.getPrincipal() instanceof CustomOAuth2User) {
            email = ((CustomOAuth2User) authentication.getPrincipal()).getAttribute("email");
        } else if (authentication.getPrincipal() instanceof DefaultOidcUser) {
                email = ((DefaultOidcUser) authentication.getPrincipal()).getEmail();
            } else {
                throw new RuntimeException("Unknown UserDetails type: " + authentication.getPrincipal().getClass());
            }
        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                    return new CustomOAuth2UserService().createUser(oAuth2User);
                });
    }
    public void updateUser(User updatedUser) {
        User existingUser = userRepository.findByEmail(updatedUser.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setDescription(updatedUser.getDescription());
        existingUser.setProfilePicture(updatedUser.getProfilePicture());
        existingUser.setLearningStats(updatedUser.getLearningStats());
        userRepository.save(existingUser);
    }

}
