package pl.edu.agh.simulator.domain;

import java.util.List;

public class Route {
    private String id;

    private List<Location> route;

    private Truck truck;

    public String getId() {
        return id;
    }

    public List<Location> getRoute() {
        return route;
    }

    public void setRoute(List<Location> route) {
        this.route = route;
    }

    public void addContainer(Location containerLocation){
        route.add(containerLocation);
    }


    public Truck getTruck() {
        return truck;
    }

    public void setTruck(Truck truck) {
        this.truck = truck;
    }
}
