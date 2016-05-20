package pl.edu.agh.sogo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.Route;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.persistence.RouteRepository;
import pl.edu.agh.sogo.service.IRouteService;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class RouteService implements IRouteService {
    @Autowired
    RouteRepository routeRepository;

    @Override
    public Map<Truck, Route> getRoutes() {
        List<Route> routes = routeRepository.findAll();
        Map<Truck, Route> result = routes.stream().collect(Collectors.toMap(Route::getTruck, Function.identity()));
        return result;
    }

    @Override
    public Route getRoute(String registration) {
        return routeRepository.findByTruckRegistration(registration);
    }
}
