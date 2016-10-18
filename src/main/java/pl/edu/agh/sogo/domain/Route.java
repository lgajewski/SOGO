package pl.edu.agh.sogo.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "routes")
public class Route {
    @Id
    private String id;

    private List<Location> locations;

    @DBRef
    private Truck truck;

    public String getId() {
        return id;
    }

    public List<Location> getRoute() {
        return locations;
    }

    public void setRoute(List<Location> route) {
        this.locations = route;
    }

    public void addContainer(Location containerLocation){
        locations.add(containerLocation);
    }

    public Truck getTruck() {
        return truck;
    }

    public void setTruck(Truck truck) {
        this.truck = truck;
    }

//    public String toString(){
//        return "{id + " + id +
//            ", route = " + route.stream().map(Location::toString).collect(Collectors.joining(",\n")) +
//            "}";
//    }
}
