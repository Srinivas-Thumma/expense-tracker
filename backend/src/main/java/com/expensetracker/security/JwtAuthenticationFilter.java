package com.expensetracker.security;

import com.expensetracker.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    //OncePerRequestFilter — guarantees this filter runs exactly once per request. Not twice, not zero times. Once.

    private final JwtService jwtService;
    // private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        // this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

                //Reads the Authorization header from the incoming request. If there's no header or it doesn't start with "Bearer " — just let the request pass through without setting any user. It'll hit SecurityConfig rules next and either be allowed (public route) or blocked (protected route).
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = header.substring(7);//substring(7) removes the first 7 characters "Bearer " and gives you just the raw token string. "Bearer " is exactly 7 characters.

            String email = jwtService.getEmail(token);
            String role = jwtService.getRole(token);
            //Calls JwtService to decode the token and extract who this user is.

            var authentication = new UsernamePasswordAuthenticationToken(
            email,null,List.of(new SimpleGrantedAuthority(role))
             );
             //Creates an authentication object with the email and role, then stores it in SecurityContextHolder. Think of SecurityContextHolder as a box that holds "who is currently logged in" for this request.
             //Every service and controller can now call SecurityContextHolder.getContext().getAuthentication().getName() to get the current user's email. That's how services know whose data to fetch.

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
        } catch (Exception ignored) {
            SecurityContextHolder.clearContext();
            //If token is expired, tampered, or invalid — the JWT library throws an exception. We catch it, clear any authentication, and the request continues with no user set. SecurityConfig will then block it with 401.
        }

        filterChain.doFilter(request, response);//This line at the end is critical — it passes the request to the next filter or controller. If you forget this, the request just stops here and nothing happens.
    }
}
