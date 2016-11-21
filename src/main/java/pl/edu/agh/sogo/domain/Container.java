package pl.edu.agh.sogo.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Document(collection = "containers")
public class Container {
    @Id
    private String id;

    private int capacity;

    private String type;

    @GeoSpatialIndexed
    private Location location;

    private String address;

    @DBRef
    private User repairer;

    private Map<String, Sensor> sensors;

    public Container(){
        this.sensors = new HashMap<>();
    }

    public String getId() {
        return id;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Map<String, Sensor> getSensors() {
        return sensors;
    }

    public void setSensors(Map<String, Sensor> sensors) {
        this.sensors = sensors;
    }

    public void addSensor(String sensorType, Sensor sensor){
        sensors.put(sensorType, sensor);
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public User getRepairer() {
        return repairer;
    }

    public void setRepairer(User repairer) {
        this.repairer = repairer;
    }


    public String toString(){
        return "{id = " + id +
            ", type = " + type +
            ", capacity = " + capacity +
            ", location = "+ location +
            ", address = "+ address +
            ", repairer = "+ repairer +
            ", sensors = {" + sensors.entrySet().stream().map(a ->a.getValue().toString()).collect(Collectors.joining(", ")) + "}}";
    }
}
