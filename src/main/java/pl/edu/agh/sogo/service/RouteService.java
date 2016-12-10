package pl.edu.agh.sogo.service;

import com.graphhopper.jsprit.core.algorithm.VehicleRoutingAlgorithm;
import com.graphhopper.jsprit.core.algorithm.box.Jsprit;
import com.graphhopper.jsprit.core.problem.VehicleRoutingProblem;
import com.graphhopper.jsprit.core.problem.job.Job;
import com.graphhopper.jsprit.core.problem.solution.VehicleRoutingProblemSolution;
import com.graphhopper.jsprit.core.problem.solution.route.VehicleRoute;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleImpl;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleTypeImpl;
import com.graphhopper.jsprit.core.reporting.SolutionPrinter;
import com.graphhopper.jsprit.core.util.Coordinate;
import com.graphhopper.jsprit.core.util.Solutions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Route;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.persistence.ContainerRepository;
import pl.edu.agh.sogo.persistence.RouteRepository;
import pl.edu.agh.sogo.persistence.TruckRepository;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class RouteService {

    private static final Logger log = LoggerFactory.getLogger(RouteService.class);

    private int CONTAINERS_LIMIT = 8;
    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private ContainerRepository containerRepository;

    public Map<Truck, Route> getRoutes() {
        List<Route> routes = routeRepository.findAll();
        Map<Truck, Route> result = routes.stream().collect(Collectors.toMap(Route::getTruck, Function.identity()));
        log.info("getRoutes()");
        return result;
    }

    public List<Location> getRoute(String registration) {
        Route route = routeRepository.findByTruck(truckRepository.findByRegistration(registration));
        if (route == null) {
            return new ArrayList<>();
        }
        return route.getRoute();
    }

    public void generateRoutes(List<String> availableContainers) {
        for (Truck truck : truckRepository.findAll()) {
            //TODO: set starting location for each truck(new field?)

            Location startingLocation = new Location(50.0690377, 20.0064407);
            Route route = generateRoute(startingLocation, truck, availableContainers);
            if (route != null) {
                log.info("Truck = " + route.getTruck());
                int i = 0;
                for (Location location : route.getRoute()) {
                    i++;
                    log.info("Location " + i + " = " + location);
                }
                routeRepository.save(route);
            }
        }
        if (!availableContainers.isEmpty()) {
            generateRoutes(availableContainers);
        }
    }


    public void generateRoutes2() {
        VehicleRoutingProblem.Builder vrpBuilder = VehicleRoutingProblem.Builder.newInstance();
//        vrpBuilder.addJob(service).addJob(service2).addJob(service3).addVehicle(vehicle1).addVehicle(vehicle2);
        List<Container> containers = containerRepository.findAll();
        List<Truck> trucks = truckRepository.findAll();

        for (Container container : containers){
            com.graphhopper.jsprit.core.problem.job.Service service = com.graphhopper.jsprit.core.problem.job.Service.Builder.newInstance(container.getId())
                .setName("container"+container.getId())
                .addSizeDimension(0, (int)(container.getCapacity() * ((double) container.getSensors().get("load").getValue()) / 100))
                .setLocation(com.graphhopper.jsprit.core.problem.Location.newInstance(container.getLocation().getLatitude(), container.getLocation().getLongitude()))
                .build();
            vrpBuilder.addJob(service);
        }

        for(Truck truck : trucks){
            // specify type of both vehicles
            VehicleTypeImpl vehicleType = VehicleTypeImpl.Builder.newInstance("vehicleType"+truck.getId())
                .addCapacityDimension(0, truck.getCapacity())
                .build();

            // specify vehicle1 with different start and end locations
            VehicleImpl vehicle1 = VehicleImpl.Builder.newInstance(truck.getRegistration())
                .setType(vehicleType)
                .setStartLocation(com.graphhopper.jsprit.core.problem.Location.newInstance(truck.getLocation().getLatitude(), truck.getLocation().getLongitude()))
                .setReturnToDepot(false)
                .build();

            vrpBuilder.addVehicle(vehicle1);
        }



        vrpBuilder.setFleetSize(VehicleRoutingProblem.FleetSize.FINITE);
        VehicleRoutingProblem problem = vrpBuilder.build();

        // define an algorithm out of the box - this creates a large neighborhood search algorithm
        VehicleRoutingAlgorithm algorithm = Jsprit.createAlgorithm(problem);

        // search solutions
        Collection<VehicleRoutingProblemSolution> solutions = algorithm.searchSolutions();
        // get best
        VehicleRoutingProblemSolution bestSolution = Solutions.bestOf(solutions);

        SolutionPrinter.print(problem, bestSolution, SolutionPrinter.Print.VERBOSE);
        SolutionPrinter.print(problem, bestSolution, SolutionPrinter.Print.CONCISE);

        routeRepository.deleteAll();
        for(VehicleRoute route : bestSolution.getRoutes()){
//            System.out.println(route.getVehicle().getId());
            Route truckRoute = new Route();
            List<Location> locations = new ArrayList<>();
            truckRoute.setTruck(truckRepository.findByRegistration(route.getVehicle().getId()));
            Coordinate truckCoords = route.getVehicle().getStartLocation().getCoordinate();
            locations.add(new Location(truckCoords.getX(), truckCoords.getY()));
            for(Job container : route.getTourActivities().getJobs()){
//                System.out.println(container.getId());
                Container cont = containerRepository.findOne(container.getId());
                locations.add(cont.getLocation());
            }
            truckRoute.setRoute(locations);
//            System.out.println("Truck: " + truckRoute.getTruck().getRegistration()+"\nLocations: " + locations.toString());
            routeRepository.save(truckRoute);
        }
    }


    private Route generateRoute(Location startingLocation, Truck truck, List<String> availableContainers) {
        List<Location> locations = new LinkedList<>();
        Route route = null;
        Container container = null;
        List<Container> nearestContainersToStartingLocation = containerRepository.findByLocationNear(new Point(startingLocation.getLongitude(), startingLocation.getLatitude()));
        //TODO: move capacity multiplier to configuration file
        int truckCapacity = (int) (truck.getCapacity() * 0.9);
        int i = 0;

        if (nearestContainersToStartingLocation != null) {
            do {
                container = nearestContainersToStartingLocation.get(i);
                i++;
                if (availableContainers.contains(container.getId())) {
                    break;
                }
            } while (i < nearestContainersToStartingLocation.size());
        }
        if (container != null) {
            while (truckCapacity - truck.getLoad() > (container.getCapacity() * ((double) container.getSensors().get("load").getValue()) / 100) && !availableContainers.isEmpty() && locations.size() < CONTAINERS_LIMIT) {
                availableContainers.remove(container.getId());
                locations.add(container.getLocation());
                truckCapacity -= (container.getCapacity() * ((double) container.getSensors().get("load").getValue()) / 100);
                List<Container> nearestContainers = containerRepository.findByLocationNear(new Point(container.getLocation().getLongitude(), container.getLocation().getLatitude()));
                i = 0;
                if (nearestContainers != null) {
                    do {
                        container = nearestContainers.get(i);
                        i++;
                    } while (i < nearestContainers.size() && !availableContainers.contains(container.getId()));
                }
            }
        }

        if (!locations.isEmpty()) {
            route = new Route();
            route.setTruck(truck);
            route.setRoute(locations);
        }
        return route;
    }

}
