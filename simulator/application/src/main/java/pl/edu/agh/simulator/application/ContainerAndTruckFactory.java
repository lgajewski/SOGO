package pl.edu.agh.simulator.application;

import pl.edu.agh.simulator.domain.Container;
import pl.edu.agh.simulator.domain.Location;
import pl.edu.agh.simulator.domain.Sensor;
import pl.edu.agh.simulator.domain.Truck;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class ContainerAndTruckFactory {
    public List<Truck> createTrucks(int number){
        Random r = new Random();
        List<Truck> trucks = new ArrayList<>();
        for(int i=0;i < number; i++) {
            Truck truck = new Truck("KRA "+r.nextInt(10)+r.nextInt(10)+r.nextInt(10)+r.nextInt(10), r.nextInt(1000)+1000);
            truck.setLocation(new Location(50.047+(r.nextDouble()*24/1000), 19.915+(r.nextDouble()*54/1000)));
            truck.setUser(null);
            truck.setAddress(null);
            truck.setLoad(r.nextInt(1000));
            trucks.add(truck);
        }
        return trucks;
    }

    public List<Container> createContainers(int number){
        Random r = new Random();
        String[] types = {"blue", "green", "yellow"};
        List<Container> containers = new ArrayList<>();
        for(int i=0;i < number; i++) {
            Container container = new Container();

            container.setCapacity(100+i);
            container.setType(types[r.nextInt(3)]);
            container.setAddress(null);
            Sensor loadSensor = new Sensor<Double>();
            int errorCodeRange = 1;
            if(r.nextInt(2) > 0){
                errorCodeRange = 4;
            }
            loadSensor.setErrorCode(r.nextInt(errorCodeRange));
            loadSensor.setValue(r.nextDouble()*100);
            container.addSensor("load", loadSensor);

            Sensor smellSensor = new Sensor<Double>();
            smellSensor.setErrorCode(r.nextInt(errorCodeRange));
            smellSensor.setValue(r.nextInt(10));
            container.addSensor("smell", smellSensor);

            Sensor deviceSensor = new Sensor<Integer>();
            deviceSensor.setErrorCode(r.nextInt(errorCodeRange));
            deviceSensor.setValue(r.nextInt(100));
            container.addSensor("device", deviceSensor);
            container.setLocation(new Location(50.047+(r.nextDouble()*24/1000), 19.915+(r.nextDouble()*54/1000)));

            containers.add(container);
        }
        return containers;
    }
}
