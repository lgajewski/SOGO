package pl.edu.agh.sogo.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.List;

public class Route {
    @Id
    private String id;

    private List<Location> route;

    @DBRef
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
