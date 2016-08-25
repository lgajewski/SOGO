/*
 * Copyright © 2016 and Confidential to Pegasystems Inc. All rights reserved.
 */

package pl.edu.agh.sogo.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Route;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.persistence.ContainerRepository;
import pl.edu.agh.sogo.service.IRouteService;
import pl.edu.agh.sogo.service.impl.RouteService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private static final Logger log = LoggerFactory.getLogger(RouteService.class);

    @Autowired
    IRouteService routeService;

    @Autowired
    ContainerRepository containerRepository;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET)
    public Map<Truck, Route> getRoutes() {
        log.info("[GET][/api/routes] getRoutes()");
        return routeService.getRoutes();
    }

    @ResponseBody
    @RequestMapping(value = "/{registration}", method = RequestMethod.GET)
    public Route getRoute(@PathVariable(value = "registration") String registration) {
        log.info("[GET][/api/routes/"+registration+"] getRoute("+registration+")");
        return routeService.getRoute(registration);
    }


    @ResponseBody
    @RequestMapping(value = "/generate", method = RequestMethod.POST)
    public void generateRoutes() {
        log.info("[POST][/api/routes/generate] generateRoutes()");
        List<String> availableContainers = containerRepository.findAll().stream().map(Container::getId).collect(Collectors.toList());
        routeService.generateRoutes(availableContainers);
    }

}
