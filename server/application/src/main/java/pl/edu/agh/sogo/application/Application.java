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
        User user = new User();
        user.setUsername("janek");
        user.setEmail("przykladowyEmail@123.pl");
        user.setFirstName("Jan");
        user.setLastName("Kowalski");
        user.setEnabled(true);
        user.setPassword("najlepszehaslonaswiecie");
        userRepository.save(user);
    }

    private void createTrucks(){
        Truck truck = new Truck("KRA 1234", 2000);
        truck.setLocation(new Location(50.0604447, 19.9377967));
        truck.setUser(userRepository.findByUsername("janek"));
        truckRepository.save(truck);
    }

    private void createDevices(){
        Device device = new Device();
        Sensor loadSensor = new Sensor<Double>();
        loadSensor.setErrorCode(0);
        loadSensor.setValue(59.9);
        device.addSensor("load", loadSensor);

        Sensor smellSensor = new Sensor<Double>();
        smellSensor.setErrorCode(0);
        smellSensor.setValue(5);
        device.addSensor("smell", smellSensor);

        Sensor deviceSensor = new Sensor<Integer>();
        deviceSensor.setErrorCode(1);
        deviceSensor    .setValue(123123);
        device.addSensor("device", deviceSensor);

        deviceRepository.save(device);

    }

    private void createContainers(){
        Container container = new Container();
        container.setCapacity(1333);
        container.setDevice(deviceRepository.findAll().get(0));
        container.setLocation(new Location(50.0645089, 19.9366699));
        containerRepository.save(container);
    }

    private void createRoutes(){
        Route route = new Route();
        route.setTruck(truckRepository.findByRegistration("KRA 1234"));
        List<Location> locationList = new ArrayList<>();
        locationList.add(new Location(50.0645089, 19.9366699));
        locationList.add(new Location(50.0745089, 19.9366699));
        locationList.add(new Location(50.0645089, 20.0366699));
        locationList.add(new Location(51.0645089, 19.8566699));
        route.setRoute(locationList);
        routeRepository.save(route);
    }
}



