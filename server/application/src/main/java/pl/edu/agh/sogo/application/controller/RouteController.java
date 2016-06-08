package pl.edu.agh.sogo.application.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.domain.Route;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.service.IRouteService;

import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/routes")
public class RouteController {
    @Autowired
    IRouteService routeService;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET)
    public Map<Truck, Route> getRoutes() {
        return routeService.getRoutes();
    }

    @ResponseBody
    @RequestMapping(value = "/{registration}", method = RequestMethod.GET)
    public Route getRoute(@PathVariable(value = "registration") String registration) {
        return routeService.getRoute(registration);
    }
}
