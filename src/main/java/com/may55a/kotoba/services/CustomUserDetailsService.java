package com.may55a.kotoba.services;

import com.may55a.kotoba.models.AuthProvider;
import com.may55a.kotoba.models.CustomUserDetails;
import com.may55a.kotoba.models.User;
import com.may55a.kotoba.repositories.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (!user.getAuthProvider().equals(AuthProvider.LOCAL)) {
            throw new UsernameNotFoundException("Please use Google login for this account.");
        }
        return new CustomUserDetails(
                user
        );
    }
}
