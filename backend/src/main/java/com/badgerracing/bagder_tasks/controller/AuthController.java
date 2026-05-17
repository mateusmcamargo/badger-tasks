package com.badgerracing.bagder_tasks.controller;

import com.badgerracing.bagder_tasks.domain.entity.User;
import com.badgerracing.bagder_tasks.dto.request.LoginRequest;
import com.badgerracing.bagder_tasks.dto.response.AuthResponse;
import com.badgerracing.bagder_tasks.repository.UserRepository;
import com.badgerracing.bagder_tasks.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {

        // login accepts email or ra (RNF-04)
        User user = userRepository.findByEmail(request.login())
                .or(() -> userRepository.findByRa(request.login()))
                .orElseThrow(() -> new BadCredentialsException("Invalid Credentials"));

        // auth via email
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getEmail(), request.password())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(
            token,
            user.getId().toString(),
            user.getEmail(),
            user.getRa(),
            user.getName(),
            user.getRole().getName().name(),
            user.getArea().getName().name()
        ));
    }
}