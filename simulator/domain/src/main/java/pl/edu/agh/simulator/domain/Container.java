package pl.edu.agh.simulator.domain;

import java.util.HashMap;
import java.util.Map;

public class Container {

    private String id;

    private int capacity;

    private String type;

    private Location location;

    private String address;

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
}
