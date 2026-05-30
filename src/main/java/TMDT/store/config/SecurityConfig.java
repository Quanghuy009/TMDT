package TMDT.store.config;

import TMDT.store.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // Static pages
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/category",
                                "/pages/**",
                                "/fragments/**"
                        ).permitAll()

                        // Static resources
                        .requestMatchers(
                                "/js/**",
                                "/css/**",
                                "/images/**",
                                "/assets/**",
                                "/favicon.ico"
                        ).permitAll()

                        // Public APIs
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/products/**",
                                "/api/flash-sale/**",
                                "/api/flash-sales/**",
                                "/api/banners/**",
                                "/api/banner/**",
                                "/api/hero-banner/**",
                                "/api/hero-banners/**",
                                "/api/featured-products/**",
                                "/api/recommended-products/**",
                                "/api/best-seller/**",
                                "/api/best-sellers/**"
                        ).permitAll()

                        // Admin APIs
                        //.requestMatchers("/api/admin/**")
                        //.hasRole("ADMIN")
                        // Admin APIs - tạm thời mở để test giao diện admin
                        .requestMatchers("/api/admin/**")
                        .permitAll()

                        // User APIs
                        .requestMatchers("/api/cart/**")
                        .hasAnyRole("USER", "ADMIN")

                        .requestMatchers("/api/orders/**")
                        .hasAnyRole("USER", "ADMIN")

                        // Others
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }
}