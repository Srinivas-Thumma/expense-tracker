package com.expensetracker.config;

import com.expensetracker.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity //activates Spring Security for the application
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable) //CSRF protection is for browser form submissions. Since your frontend uses JWT tokens via Axios, not browser forms, CSRF is irrelevant and disabled.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) //STATELESS means the server never creates a session or remembers any user between requests. Every request must carry its own JWT token. This is the fundamental difference between JWT auth and traditional session auth.
               .authorizeHttpRequests(auth -> auth
                 .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() //OPTIONS requests are browser preflight checks for CORS. Always allow them or your frontend can't make any API calls.
                 .requestMatchers("/profile-pictures/**").permitAll() //Profile picture images are served publicly — no token needed to load them.
                .requestMatchers("/api/health", "/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN") //Only ROLE_ADMIN can access admin routes. If ROLE_USER tries, they get 403 Forbidden.
                .requestMatchers("/api/**").hasAnyRole("USER", "ADMIN") //Everything else under /api/ requires either role — so any logged in user can access it.
                .anyRequest().authenticated() //Any other request not matched above still needs authentication.   
            )
            //Disables Spring's built-in login form and basic auth popup. You're handling auth yourself with JWT so these are turned off.
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
            //Adds your custom JWT filter BEFORE Spring's default authentication filter. This is how your filter runs on every request.
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
    //Registers BCrypt as a Spring bean so it can be injected anywhere. When registering a user, the AuthService injects this and calls passwordEncoder.encode(password) before saving. When logging in, it calls passwordEncoder.matches(rawPassword, storedHash) to verify.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //CORS is a browser security rule — by default browsers block frontend JavaScript from calling a different origin. Your React app runs on port 5173, your backend on 8080 — different ports = different origin = blocked by default. This config explicitly allows your frontend to call your backend.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
       config.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "http://127.0.0.1:5173"
));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));//only these HTTP methods are allowed from the frontend.
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));//only Authorization and Content-Type headers are allowed.
        config.setAllowCredentials(true);// allows cookies and auth headers to be sent cross-origin.

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
