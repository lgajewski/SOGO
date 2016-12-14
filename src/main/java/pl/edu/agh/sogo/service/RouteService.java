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
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Route;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.persistence.ContainerRepository;
import pl.edu.agh.sogo.persistence.RouteRepository;
import pl.edu.agh.sogo.persistence.TruckRepository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class RouteService {

    private static final Logger log = LoggerFactory.getLogger(RouteService.class);

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

    public void generateRoutes() {
        VehicleRoutingProblem.Builder vrpBuilder = VehicleRoutingProblem.Builder.newInstance();
        List<Container> containers = containerRepository.findAll();
        List<Truck> trucks = truckRepository.findAll();

        for (Container container : containers) {
            com.graphhopper.jsprit.core.problem.job.Service service = com.graphhopper.jsprit.core.problem.job.Service.Builder.newInstance(container.getId())
                .setName("container" + container.getId())
                .addSizeDimension(0, (int) (container.getCapacity() * ((double) container.getSensors().get("load").getValue()) / 100))
                .setLocation(com.graphhopper.jsprit.core.problem.Location.newInstance(container.getLocation().getLatitude(), container.getLocation().getLongitude()))
                .build();
            vrpBuilder.addJob(service);
        }

        for (Truck truck : trucks) {
            // specify type of both vehicles
            VehicleTypeImpl vehicleType = VehicleTypeImpl.Builder.newInstance("vehicleType" + truck.getId())
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

        for (VehicleRoute route : bestSolution.getRoutes()) {
            Route truckRoute = new Route();
            List<Location> locations = new ArrayList<>();
            truckRoute.setTruck(truckRepository.findByRegistration(route.getVehicle().getId()));
            Coordinate truckCoords = route.getVehicle().getStartLocation().getCoordinate();
            locations.add(new Location(truckCoords.getX(), truckCoords.getY()));
            for (Job container : route.getTourActivities().getJobs()) {
                Container cont = containerRepository.findOne(container.getId());
                locations.add(cont.getLocation());
            }
            truckRoute.setRoute(locations);
            routeRepository.save(truckRoute);
        }
    }


}
