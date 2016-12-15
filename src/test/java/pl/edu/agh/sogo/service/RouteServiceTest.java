package pl.edu.agh.sogo.service;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import pl.edu.agh.sogo.domain.*;
import pl.edu.agh.sogo.persistence.ContainerRepository;
import pl.edu.agh.sogo.persistence.RouteRepository;
import pl.edu.agh.sogo.persistence.TruckRepository;

import javax.inject.Inject;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class RouteServiceTest {

    @Inject
    private TruckService truckService;

    @Inject
    private ContainerService containerService;

    @Inject
    private RouteRepository routeRepository;

    @Inject
    private TruckRepository truckRepository;

    @Inject
    private ContainerRepository containerRepository;

    @Inject
    private RouteService routeService;

    @Before
    @After
    public void clear() {
        routeRepository.deleteAll();
        truckRepository.deleteAll();
        containerRepository.deleteAll();
    }

    @Test
    public void testGenerateRoutes() {
        List<Container> containers = createSampleContainers(50);
        List<Truck> trucks = createSampleTrucks(20);

        // save to database
        containers.forEach(container -> containerService.add(container));
        trucks.forEach(truck -> truckService.add(truck));

        routeService.generateRoutes();

        // verify
        List<Location> expectedLocations = containers.stream().map(Container::getLocation).collect(Collectors.toList());

        Map<Truck, Route> routes = routeService.getRoutes();
        assertFalse(routes.isEmpty());

        long actualLocationsAmount = routes.values().stream()
            .map(Route::getRoute)
            .flatMap(Collection::stream)
            .count();

        assertTrue(actualLocationsAmount > expectedLocations.size());

        long actualLocationsAmountPerTruck = trucks.stream()
            .map(truck -> routeService.getRoute(truck.getRegistration()))
            .flatMap(Collection::stream)
            .count();

        assertEquals(actualLocationsAmount, actualLocationsAmountPerTruck);
    }

    private List<Container> createSampleContainers(int amount) {
        String[] types = {"green", "blue", "yellow"};

        return IntStream.range(0, amount).mapToObj(i -> {
            int capacity = ((i * 100) + 100) % 1400;
            int load = ((i * 25) % amount) * capacity / amount / 2;
            double distance = ((double) i / amount);
            Location location = new Location(50 + distance, 20 + distance);
            String type = types[i % 3];

            return createSampleContainer(location, type, capacity, load);
        }).collect(Collectors.toList());
    }

    private Container createSampleContainer(Location location, String type, int capacity, int load) {
        Sensor<Double> loadSensor = new Sensor<>();
        loadSensor.setValue((double) load);

        Map<String, Sensor> sensors = new HashMap<>();
        sensors.put("load", loadSensor);

        Container container = new Container();
        container.setCapacity(capacity);
        container.setLocation(location);
        container.setType(type);
        container.setSensors(sensors);

        return container;
    }


    private List<Truck> createSampleTrucks(int amount) {
        return IntStream.range(0, amount).mapToObj(i -> {
            String registration = "KR " + i;
            int capacity = ((i * 100) + 100) % 1400;
            double distance = ((double) i / amount);
            Location location = new Location(50 + distance, 20 + distance);
            int load = ((i * 25) % amount) * capacity / amount;

            return createSampleTruck(registration, location, load, capacity);
        }).collect(Collectors.toList());

    }

    private Truck createSampleTruck(String registration, Location location, int load, int capacity) {
        Truck truck = new Truck();
        truck.setRegistration(registration);
        truck.setLocation(location);
        truck.setLoad(load);
        truck.setCapacity(capacity);
        return truck;
    }


}
