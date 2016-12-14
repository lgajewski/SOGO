/*
 * Copyright © 2016 and Confidential to Pegasystems Inc. All rights reserved.
 */

package pl.edu.agh.sogo.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Route;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.security.SecurityConstants;
import pl.edu.agh.sogo.service.RouteService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private static final Logger log = LoggerFactory.getLogger(RouteService.class);

    @Autowired
    private RouteService routeService;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET)
    public Map<Truck, Route> getRoutes() {
        log.info("[GET][/api/routes] getRoutes()");
        return routeService.getRoutes();
    }

    @ResponseBody
    @RequestMapping(value = "/{registration}", method = RequestMethod.GET)
    public List<Location> getRoute(@PathVariable(value = "registration") String registration) {
        log.info("[GET][/api/routes/" + registration + "] getRoute(" + registration + ")\n" + routeService.getRoute(registration));
        return routeService.getRoute(registration);
    }


    @ResponseBody
    @RequestMapping(value = "/generate", method = RequestMethod.POST)
    @Secured(SecurityConstants.ADMIN)
    public void generateRoutes() {
        log.info("[POST][/api/routes/generate] generateRoutes()");
        routeService.generateRoutes();
    }

}
