package pl.edu.agh.sogo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Sensor;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.persistence.RouteRepository;
import pl.edu.agh.sogo.service.directions.DirectionsService;
import pl.edu.agh.sogo.service.geocoder.GoogleMapsReverseGeocoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ScheduledFuture;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Service
public class SimulatorService {

    private static final Logger log = LoggerFactory.getLogger(GoogleMapsReverseGeocoder.class);

    @Autowired
    private TruckService truckService;

    @Autowired
    private RouteService routeService;

    @Autowired
    private ContainerService containerService;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private TaskScheduler scheduler;

    @Autowired
    private DirectionsService directionsService;

    private Random random = new Random();

    private SimulationHandler truckSimulationHandler = new SimulationHandler(TruckSimulation::new);
    private SimulationHandler containerSimulationHandler = new SimulationHandler(ContainerSimulation::new);

    public List<Truck> createTrucks(int number) {
        Random r = new Random();
        List<Truck> trucks = new ArrayList<>();
        for (int i = 0; i < number; i++) {
            Truck truck = new Truck("KRA " + r.nextInt(10) + r.nextInt(10) + r.nextInt(10) + r.nextInt(10), r.nextInt(1000) + 1000);
            truck.setLocation(new Location(50.047 + (r.nextDouble() * 24 / 1000), 19.915 + (r.nextDouble() * 54 / 1000)));
            truck.setLoad(r.nextInt(1000));
            trucks.add(truck);
        }
        return trucks;
    }

    public List<Container> createContainers(int number) {
        Random r = new Random();
        String[] types = {"blue", "green", "yellow"};
        List<Container> containers = new ArrayList<>();
        for (int i = 0; i < number; i++) {
            Container container = new Container();

            container.setCapacity(100 + i);
            container.setType(types[r.nextInt(3)]);
            Sensor<Double> loadSensor = new Sensor<>();
            int errorCodeRange = 1;
            if (r.nextDouble() > 0.1) {
                errorCodeRange = 4;
            }
            loadSensor.setErrorCode(r.nextInt(errorCodeRange));
            loadSensor.setValue(r.nextDouble() * 100);
            container.addSensor("load", loadSensor);

            Sensor<Integer> smellSensor = new Sensor<>();
            smellSensor.setErrorCode(r.nextInt(errorCodeRange));
            smellSensor.setValue(r.nextInt(10));
            container.addSensor("smell", smellSensor);

            Sensor<Integer> deviceSensor = new Sensor<>();
            deviceSensor.setErrorCode(r.nextInt(errorCodeRange));
            deviceSensor.setValue(r.nextInt(100));
            container.addSensor("device", deviceSensor);
            container.setLocation(new Location(49.99 + (r.nextDouble() / 8), 19.827 + (r.nextDouble() / 4)));

            containers.add(container);
        }
        return containers;
    }

    public boolean isTruckSimulationRunning() {
        return truckSimulationHandler.isRunning();
    }

    public void startTruckSimulation(long delay) {
        truckSimulationHandler.start(delay);
    }

    public void stopTruckSimulation() {
        truckSimulationHandler.stop();
    }

    public boolean isContainerSimulationRunning() {
        return containerSimulationHandler.isRunning();
    }

    public void startContainerSimulation(long delay) {
        containerSimulationHandler.start(delay);
    }

    public void stopContainerSimulation() {
        containerSimulationHandler.stop();
    }

    @SuppressWarnings("WeakerAccess")
    public class SimulationHandler {
        private ScheduledFuture<?> scheduledFuture;
        private Supplier<Runnable> supplier;

        private SimulationHandler(Supplier<Runnable> provider) {
            this.supplier = provider;
        }

        public void start(long delay) {
            if (!isRunning()) {
                scheduledFuture = scheduler.scheduleWithFixedDelay(supplier.get(), delay);
            }
        }

        public void stop() {
            if (isRunning()) {
                scheduledFuture.cancel(true);
            }
        }

        public boolean isRunning() {
            return scheduledFuture != null && !scheduledFuture.isDone();
        }
    }

    private class TruckSimulation implements Runnable {
        Map<String, List<Location>> routes = routeService.getRoutes().keySet().stream().collect(
            Collectors.toMap(Truck::getRegistration, x -> directionsService.getPath(routeRepository.findByTruck(x).getRoute())));

        @Override
        public void run() {
            routeService.getRoutes().keySet().forEach(truck -> {
                List<Location> locations = routes.get(truck.getRegistration());
                if(locations.isEmpty()){
                    routes.put(truck.getRegistration(), directionsService.getPath(routeRepository.findByTruck(truck).getRoute()));
                }
                Location location = routes.get(truck.getRegistration()).remove(0);
                truckService.updateLocation(truck.getRegistration(), location);
            });
        }
    }

    @SuppressWarnings("unchecked")
    private class ContainerSimulation implements Runnable {

        @Override
        public void run() {
            containerService.getContainers().forEach(container -> {
                for (String sensorType : container.getSensors().keySet()) {
                    Sensor sensor = container.getSensors().get(sensorType);
                    if (sensorType.equalsIgnoreCase("device")) {
                        if (Double.parseDouble(sensor.getValue().toString()) <= 99) {
                            sensor.setValue((int) (Double.parseDouble(sensor.getValue().toString()) + 1));
                        }
                    } else {
                        double rn = random.nextDouble();
                        if (Double.parseDouble(sensor.getValue().toString()) + rn < 100.0) {
                            sensor.setValue(Double.parseDouble(sensor.getValue().toString()) + rn);
                        }
                    }
                }

                containerService.update(container);
            });
        }

    }
}
