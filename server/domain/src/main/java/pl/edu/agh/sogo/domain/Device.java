package pl.edu.agh.sogo.domain;

import org.springframework.data.annotation.Id;

import java.util.HashMap;
import java.util.Map;

public class Device {
    @Id
    private String id;

    private Map<String, Sensor> sensors;

    public Device(){
        this.sensors = new HashMap<>();
    }

    public String getId() {
        return id;
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
}
