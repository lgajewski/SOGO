package pl.edu.agh.sogo.application.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Route;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.persistence.ContainerRepository;
import pl.edu.agh.sogo.service.IRouteService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/routes")
public class RouteController {
    @Autowired
    IRouteService routeService;

    @Autowired
    ContainerRepository containerRepository;

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


    @ResponseBody
    @RequestMapping(value = "/generate", method = RequestMethod.POST)
    public void generateRoutes() {
        List<String> availableContainers = containerRepository.findAll().stream().map(Container::getId).collect(Collectors.toList());
        routeService.generateRoutes(availableContainers);
    }

}
