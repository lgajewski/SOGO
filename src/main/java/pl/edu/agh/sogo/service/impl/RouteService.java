package pl.edu.agh.sogo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Route;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.persistence.ContainerRepository;
import pl.edu.agh.sogo.persistence.RouteRepository;
import pl.edu.agh.sogo.persistence.TruckRepository;
import pl.edu.agh.sogo.service.IRouteService;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class RouteService implements IRouteService {
    @Autowired
    RouteRepository routeRepository;

    @Autowired
    TruckRepository truckRepository;

    @Autowired
    ContainerRepository containerRepository;

    @Override
    public Map<Truck, Route> getRoutes() {
        List<Route> routes = routeRepository.findAll();
        Map<Truck, Route> result = routes.stream().collect(Collectors.toMap(Route::getTruck, Function.identity()));
        return result;
    }

    @Override
    public Route getRoute(String registration) {
        return routeRepository.findByTruck(truckRepository.findByRegistration(registration));
    }

    @Override
    public void generateRoutes(List<String> availableContainers) {
        for (Truck truck : truckRepository.findAll()) {
            //TODO: set starting location for each truck(new field?)
            Location startingLocation = new Location(50.0690377, 20.0064407);
            Route route = generateRoute(startingLocation, truck, availableContainers);
            if(route != null) {
                System.out.println("Truck[" + (route.getTruck().getRegistration() + "]: capacity: " + route.getTruck().getCapacity() + " load: " +route.getTruck().getLoad()));
                int i=0;
                for (Location location : route.getRoute()) {
                    i++;
                    System.out.println("Location " + i + " [" + location.getLongitude()+","+location.getLatitude()+"]");
                }
                routeRepository.save(route);
            }
        }
        if(!availableContainers.isEmpty()){
            generateRoutes(availableContainers);
        }
    }

    private Route generateRoute(Location startingLocation, Truck truck, List<String> availableContainers) {
        List<Location> locations = new LinkedList<>();
        Route route = null;
        Container container = null;
        List<Container> nearestContainersToStartingLocation = containerRepository.findByLocationNear(new Point(startingLocation.getLongitude(), startingLocation.getLatitude()));
        //TODO: move capacity multiplier to configuration file
        int truckCapacity = (int)(truck.getCapacity() * 0.9);
        int i=0;

        if(nearestContainersToStartingLocation != null) {
            do {
                container = nearestContainersToStartingLocation.get(i);
                i++;
                if(availableContainers.contains(container.getId())){
                    break;
                }
            } while (i < nearestContainersToStartingLocation.size());
        }
        if(container!=null) {
            while (truckCapacity - truck.getLoad() >  (container.getCapacity () * ((double)container.getDevice().getSensors().get("load").getValue())/100) && !availableContainers.isEmpty()){
                availableContainers.remove(container.getId());
                locations.add(container.getLocation());
                truckCapacity -= (container.getCapacity () * ((double)container.getDevice().getSensors().get("load").getValue())/100);
                List<Container> nearestContainers = containerRepository.findByLocationNear(new Point(container.getLocation().getLongitude(), container.getLocation().getLatitude()));
                i=0;
                if(nearestContainers != null) {
                    do {
                        container = nearestContainers.get(i);
                        i++;
                    } while (i < nearestContainers.size() && !availableContainers.contains(container.getId()));
                }
            }
        }

        if(!locations.isEmpty()) {
            route = new Route();
            route.setTruck(truck);
            route.setRoute(locations);
        }
        return route;
    }

}
