package pl.edu.agh.sogo.service;

import pl.edu.agh.sogo.domain.Route;
import pl.edu.agh.sogo.domain.Truck;

import java.util.Map;

public interface IRouteService {
    Map<Truck, Route> getRoutes();
    Route getRoute(String registration);
}
