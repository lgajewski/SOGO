package pl.edu.agh.simulator.domain;

import java.util.Map;

public class RouteTracker {
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
