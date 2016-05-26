package pl.edu.agh.sogo.application;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.ImportResource;
import pl.edu.agh.sogo.domain.*;
import pl.edu.agh.sogo.domain.security.User;
import pl.edu.agh.sogo.persistence.ContainerRepository;
import pl.edu.agh.sogo.persistence.DeviceRepository;
import pl.edu.agh.sogo.persistence.RouteRepository;
import pl.edu.agh.sogo.persistence.TruckRepository;
import pl.edu.agh.sogo.persistence.security.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@SpringBootApplication
@ImportResource("classpath:pl/edu/agh/sogo/application/beans.xml")
public class Application extends SpringBootServletInitializer implements CommandLineRunner{
    @Autowired
    UserRepository userRepository;

    @Autowired
    DeviceRepository deviceRepository;

    @Autowired
    ContainerRepository containerRepository;

    @Autowired
    TruckRepository truckRepository;

    @Autowired
    RouteRepository routeRepository;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... strings) throws Exception {
        userRepository.deleteAll();
        truckRepository.deleteAll();
        deviceRepository.deleteAll();
        containerRepository.deleteAll();
        routeRepository.deleteAll();

        createUsers();
        createTrucks();
        createDevices();
        createContainers();
        createRoutes();
    }

    private void createUsers(){
        for(int i=0;i < 10; i++){
            User user = new User();
            user.setUsername("janek"+i);
            user.setEmail("przykladowyEmail"+i+"@123.pl");
            user.setFirstName("Jan");
            user.setLastName("Kowalski");
            user.setEnabled(i<7);
            user.setPassword("najlepszehaslonaswiecie");
            userRepository.save(user);
        }
    }

    private void createTrucks(){
        Random r = new Random();
        for(int i=0;i < 6; i++) {
            Truck truck = new Truck("KRA "+r.nextInt(10)+r.nextInt(10)+r.nextInt(10)+r.nextInt(10), r.nextInt(1000)+1000);
            truck.setLocation(new Location(50.06+r.nextDouble()/100, 19.9377967+r.nextDouble()/100));
            truck.setUser(userRepository.findByUsername("janek"+i));
//            truck.setCapacity(1000+i);
            truck.setLoad(r.nextInt(1000));
            truckRepository.save(truck);
        }
    }

    private void createDevices(){
        Random r = new Random();
        for(int i=0;i < 10; i++) {
            Device device = new Device();
            Sensor loadSensor = new Sensor<Double>();
            loadSensor.setErrorCode(0);
            loadSensor.setValue(r.nextDouble()*100);
            device.addSensor("load", loadSensor);

            Sensor smellSensor = new Sensor<Double>();
            smellSensor.setErrorCode(0);
            smellSensor.setValue(r.nextInt(10));
            device.addSensor("smell", smellSensor);

            Sensor deviceSensor = new Sensor<Integer>();
            deviceSensor.setErrorCode(1);
            deviceSensor.setValue(r.nextInt(100));
            device.addSensor("device", deviceSensor);

            deviceRepository.save(device);
        }

    }

    private void createContainers(){
        Random r = new Random();
        String[] types = {"glass", "paper", "plastic", "electronic"};
        for(int i=0;i < 10; i++) {
            Container container = new Container();
            container.setCapacity(1300+i);
            container.setType(types[r.nextInt(4)]);
            container.setDevice(deviceRepository.findAll().get(i));
            container.setLocation(new Location(50.06 + r.nextDouble() / 100, 19.9377967 + r.nextDouble() / 100));
            containerRepository.save(container);
        }
    }

    private void createRoutes(){
        Random r = new Random();
        for(int i=0;i < 3; i++) {
            Route route = new Route();
            route.setTruck(truckRepository.findAll().get(i));
            List<Location> locationList = new ArrayList<>();
            locationList.add(new Location(50.06 + r.nextDouble() / 100, 19.9377967 + r.nextDouble() / 100));
            locationList.add(new Location(50.06 + r.nextDouble() / 100, 19.9377967 + r.nextDouble() / 100));
            locationList.add(new Location(50.06 + r.nextDouble() / 100, 19.9377967 + r.nextDouble() / 100));
            locationList.add(new Location(50.06 + r.nextDouble() / 100, 19.9377967 + r.nextDouble() / 100));
            route.setRoute(locationList);
            routeRepository.save(route);
        }
    }
}



