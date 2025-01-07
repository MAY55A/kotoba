package com.may55a.kotoba.services;

import com.may55a.kotoba.models.AuthProvider;
import com.may55a.kotoba.models.CustomOAuth2User;
import com.may55a.kotoba.models.LearningStats;
import com.may55a.kotoba.models.User;
import com.may55a.kotoba.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println("CustomOAuth2UserService called!");

        String email = oAuth2User.getAttribute("email");
        Optional<User> userOptional = userRepository.findByEmail(email);

        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            System.out.println("old user :"+user);
            if (!user.getAuthProvider().equals(AuthProvider.GOOGLE)) {
                throw new OAuth2AuthenticationException("Please log in using your local account.");
            }
        } else {
            user = createUser(oAuth2User);
            System.out.println("new user :"+user);
        }

        return new CustomOAuth2User(
                user,
                oAuth2User.getAttributes()
        );
    }

    public User createUser(OAuth2User oAuth2User) {
        User user = new User();
        user.setEmail(oAuth2User.getAttribute("email"));
        user.setUsername(oAuth2User.getAttribute("name"));
        user.setProfilePicture(oAuth2User.getAttribute("picture"));
        user.setAuthProvider(AuthProvider.GOOGLE);
        user.addRole("USER");
        user.setLearningStats(new LearningStats());
        return userRepository.save(user);
    }
}
