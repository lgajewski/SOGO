package pl.edu.agh.sogo.application.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.domain.Route;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.service.IRouteService;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/routes")
public class RouteController {
    @Autowired
    IRouteService routeService;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Map<Truck, Route>> getRoutes() {
        return new ResponseEntity<>(routeService.getRoutes(), HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "/{registration}", method = RequestMethod.GET)
    public ResponseEntity<Route> getRoute(@PathVariable(value = "registration") String registration) {
        return new ResponseEntity<>(routeService.getRoute(registration), HttpStatus.OK);
    }
}
