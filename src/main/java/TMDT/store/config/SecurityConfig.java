package TMDT.store.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        // Cho phép truy cập tất cả file static (HTML, CSS, JS, images)
                        .requestMatchers("/**").permitAll()
                        // Cho phép tất cả API (sau này sẽ chỉnh lại)
                        .requestMatchers("/api/**").permitAll()
                )
                .csrf(csrf -> csrf.disable())           // Tắt CSRF tạm thời (vì FE thuần)
                .formLogin(form -> form.disable())      // Tắt trang login mặc định
                .logout(logout -> logout.disable());    // Tắt logout mặc định

        return http.build();
    }
}