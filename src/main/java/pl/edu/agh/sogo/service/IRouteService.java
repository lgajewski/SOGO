package pl.edu.agh.sogo.service;

import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Route;
import pl.edu.agh.sogo.domain.Truck;

import java.util.List;
import java.util.Map;

public interface IRouteService {
    Map<Truck, Route> getRoutes();
    List<Location> getRoute(String registration);
    void generateRoutes(List<String> availableContainers);
}
