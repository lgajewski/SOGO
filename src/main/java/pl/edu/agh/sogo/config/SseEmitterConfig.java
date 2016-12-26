package pl.edu.agh.sogo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.function.Supplier;

@Configuration
public class SseEmitterConfig {

    @Bean
    public Supplier<SseEmitter> sseEmitterSupplier() {
        return SseEmitter::new;
    }

}
