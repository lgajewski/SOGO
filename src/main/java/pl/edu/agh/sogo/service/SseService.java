package pl.edu.agh.sogo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.function.Supplier;

@Service
public class SseService {

    private final Logger log = LoggerFactory.getLogger(SseService.class);

    private final List<SseEmitter> cache = Collections.synchronizedList(new ArrayList<>());

    @Autowired
    private Supplier<SseEmitter> sseEmitterSupplier;

    public SseEmitter provide() {
        SseEmitter sseEmitter = sseEmitterSupplier.get();
        sseEmitter.onTimeout(sseEmitter::complete);

        cache.add(sseEmitter);

        return sseEmitter;
    }

    public void emit(String eventName, Object object) {
        synchronized (cache) {
            Iterator<SseEmitter> it = cache.iterator();
            while (it.hasNext()) {
                SseEmitter sseEmitter = it.next();
                try {
                    sseEmitter.send(SseEmitter.event().name(eventName).data(object));
                } catch (Exception e) {
                    log.debug("Instance of SseEmitter is no longer usable. Unable to emit: " + e.getMessage());

                    // remove from cache
                    it.remove();
                }
            }
        }
    }

}
