/*
package pl.edu.agh.sogo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.ImportResource;
import pl.edu.agh.sogo.domain.*;
//import pl.edu.agh.sogo.domain.security.User;
import pl.edu.agh.sogo.persistence.ContainerRepository;
import pl.edu.agh.sogo.persistence.RouteRepository;
import pl.edu.agh.sogo.persistence.TruckRepository;
//import pl.edu.agh.sogo.persistence.security.UserRepository;
import pl.edu.agh.sogo.service.RouteService;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@SpringBootApplication
public class CommandLineRunnerApp extends SpringBootServletInitializer implements CommandLineRunner{
//    @Autowired
//    UserRepository userRepository;


    @Autowired
    ContainerRepository containerRepository;

    @Autowired
    TruckRepository truckRepository;

    @Autowired
    RouteRepository routeRepository;

    @Autowired
    RouteService routeService;

    public static void main(String[] args) {
        SpringApplication.run(CommandLineRunnerApp.class, args);
    }

    @Override
    public void run(String... strings) throws Exception {
//        userRepository.deleteAll();
        truckRepository.deleteAll();
        deviceRepository.deleteAll();
        containerRepository.deleteAll();
        routeRepository.deleteAll();

//        createUsers();
        createTrucks();
        createContainers();
//        createRoutes();

        List<String> availableContainers = containerRepository.findAll().stream().map(Container::getId).collect(Collectors.toList());
        routeService.generateRoutes(availableContainers);

    }

*/
/*    private void createUsers(){
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
    }*//*


    private void createTrucks(){
        Random r = new Random();
        for(int i=0;i < 6; i++) {
            Truck truck = new Truck("KRA "+r.nextInt(10)+r.nextInt(10)+r.nextInt(10)+r.nextInt(10), r.nextInt(1000)+1000);
            truck.setLocation(new Location(50.047+(r.nextDouble()*24/1000), 19.915+(r.nextDouble()*54/1000)));
//            truck.setUser(userRepository.findByUsername("janek"+i));
//            truck.setCapacity(1000+i);
            truck.setLoad(r.nextInt(1000));
            truckRepository.save(truck);
        }
    }

    private void createContainers(){
        Random r = new Random();
        String[] types = {"blue", "green", "yellow"};
        for(int i=0;i < 100; i++) {
            Container container = new Container();
            container.setCapacity(100+i);
            container.setType(types[r.nextInt(3)]);
            Sensor loadSensor = new Sensor<Double>();
            loadSensor.setErrorCode(0);
            loadSensor.setValue(r.nextDouble()*100);
            container.addSensor("load", loadSensor);

            Sensor smellSensor = new Sensor<Double>();
            smellSensor.setErrorCode(0);
            smellSensor.setValue(r.nextInt(10));
            container.addSensor("smell", smellSensor);

            Sensor deviceSensor = new Sensor<Integer>();
            deviceSensor.setErrorCode(1);
            deviceSensor.setValue(r.nextInt(100));
            container.addSensor("device", deviceSensor);

            container.setLocation(new Location(50.047+(r.nextDouble()*24/1000), 19.915+(r.nextDouble()*54/1000)));
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



*/
