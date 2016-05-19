package pl.edu.agh.sogo.domain;

import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.Map;

public class RouteTracker {
    @DBRef
    private Map<Truck, Route> routes;

    public Map<Truck, Route> getRoutes() {
        return routes;
    }

    public void setRoutes(Map<Truck, Route> routes) {
        this.routes = routes;
    }

    public void addRouteForTruck(Truck truck, Route route){
        routes.put(truck, route);
    }
}
