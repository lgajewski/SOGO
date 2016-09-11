package pl.edu.agh.sogo.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import pl.edu.agh.sogo.service.SseService;

import java.io.IOException;

/**
 * REST controller for managing Server-Side Events.
 */
@RestController
@RequestMapping("/api/sse")
public class SseController {

    private final Logger log = LoggerFactory.getLogger(SseController.class);

    @Autowired
    private SseService sseService;

    @RequestMapping
    public SseEmitter provideEmitter() throws IOException {
        return sseService.provide();
    }

}
