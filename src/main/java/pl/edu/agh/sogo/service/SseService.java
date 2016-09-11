package pl.edu.agh.sogo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.*;

@Service
public class SseService {

    private final Logger log = LoggerFactory.getLogger(SseService.class);

    private final List<SseEmitter> cache = Collections.synchronizedList(new ArrayList<>());

    public SseEmitter provide() {
        final SseEmitter sseEmitter = new SseEmitter();
        sseEmitter.onCompletion(() -> {
            log.info("onCompletion: " + Thread.currentThread());
            cache.remove(sseEmitter);
        });
        sseEmitter.onTimeout(() -> {
            log.info("onTimeout: " + Thread.currentThread());
            sseEmitter.complete();
        });

        cache.add(sseEmitter);

        return sseEmitter;
    }

    public void emit(Object object) {
        synchronized (cache) {
            Iterator<SseEmitter> it = cache.iterator();
            while (it.hasNext()) {
                SseEmitter sseEmitter = it.next();
                try {
                    sseEmitter.send(object);
                } catch (IOException | IllegalStateException e) {
                    log.warn("Unable to emit: " + e.getMessage());

                    // remove from cache onError
                    it.remove();
                }
            }
        }
    }

}