package com.expensetracker.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/*  
JWT TOKEN - It has three parts separated by dots: header.payload.signature
The payload contains your email and role in base64 — it's NOT encrypted, just encoded. Anyone can decode it. But they can't FAKE one without your secret key. That's the key distinction.
*/

@Service
public class JwtService { // This file has one job — create tokens and read tokens.
    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}") // @Value pulls values from your application.properties file. -> 86400000 milliseconds = 24 hours. That's how long a token stays valid.
    //The secret is like a password only your server knows. 
    //It's used to sign tokens so nobody can fake one.
    private long expirationMs;

    public String generateToken(String email, String role) {
    Date now = new Date();
    Date expiresAt = new Date(now.getTime() + expirationMs);

    return Jwts.builder()
            .subject(email) // stores the user's email inside the token. This is how every future request knows WHO is making it
            .claim("role", role) //stores "ROLE_USER" or "ROLE_ADMIN" inside the token.
            .issuedAt(now) //timestamp of when token was created.
            .expiration(expiresAt) //timestamp of when token dies. After this, token is rejected.
            .signWith(key()) // digitally signs the token using your secret key. This signature is what prevents tampering — if anyone changes even one character of the token, signature breaks and validation fails.
            .compact(); //converts everything into the final token string that looks like eyJhbGc...
}

    public String getRole(String token) {
    Claims claims = Jwts.parser()
            .verifyWith(key()) //checks the signature using your secret. If someone tampered with the token, this throws an exception immediately.
            .build()
            .parseSignedClaims(token) //decodes the token and extracts everything stored inside.
            .getPayload();

    return claims.get("role", String.class); //works exactly the same but returns claims.get("role", String.class) instead.
}

    public String getEmail(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject(); //returns the email that was stored when the token was created.
    }

    private SecretKey key() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
    //Converts your plain text secret string into a proper cryptographic key object that the JWT library can use. HMAC-SHA is the algorithm — it's a one-way signing algorithm. Same key signs and verifies.

}
