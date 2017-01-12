package pl.edu.agh.sogo.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.security.SecurityConstants;
import pl.edu.agh.sogo.service.ContainerService;
import pl.edu.agh.sogo.service.SimulatorService;
import pl.edu.agh.sogo.service.TruckService;

@RestController
@RequestMapping("/api/simulator")
public class SimulatorController {

    private static final Logger log = LoggerFactory.getLogger(SimulatorService.class);

    @Autowired
    private SimulatorService simulatorService;

    @Autowired
    private ContainerService containerService;

    @Autowired
    private TruckService truckService;

    /* delay in milliseconds between simulator updates */
    private final static int DELAY = 2000;


    @ResponseBody
    @RequestMapping(value = "/containers", method = RequestMethod.POST)
    @Secured(SecurityConstants.ADMIN)
    public void createContainers(@RequestBody Integer numberOfContainers) {
        log.info("[POST][/api/containers] createContainers(" + numberOfContainers + ")");
        simulatorService.createContainers(numberOfContainers).forEach(container -> containerService.add(container));
    }

    @ResponseBody
    @RequestMapping(value = "/containers", method = RequestMethod.PUT)
    @Secured(SecurityConstants.ADMIN)
    @SuppressWarnings("unchecked")
    public void emptyContainers() {
        log.info("[PUT][/api/containers] emptyContainers()");
        containerService.getContainers().forEach(container -> {
            container.getSensors().get("load").setValue(0d);
            containerService.update(container);
        });
    }

    @ResponseBody
    @RequestMapping(value = "/containers/repair", method = RequestMethod.POST)
    public void repairAllContainers() {
        log.info("[PUT][/api/containers/repair] repairAllContainers()");
        containerService.getContainers().forEach(container -> {
            container.getSensors().forEach((key, sensor) -> sensor.setErrorCode(0));
            containerService.update(container);
        });
    }

    @ResponseBody
    @RequestMapping(value = "/containers/simulate", method = RequestMethod.POST)
    @Secured(SecurityConstants.ADMIN)
    public void simulateContainers() {
        log.info("[POST][/api/simulator/trucks/simulate] simulateTrucks(), running: ");
        if (simulatorService.isContainerSimulationRunning()) {
            simulatorService.stopContainerSimulation();
        } else {
            simulatorService.startContainerSimulation(DELAY);    // delay in milliseconds
        }
    }


    @ResponseBody
    @RequestMapping(value = "/containers", method = RequestMethod.GET)
    @Secured(SecurityConstants.ADMIN)
    public String getContainersSimulatorState() {
        log.info("[GET][/api/simulator/containers] getContainersSimulatorState() returned "
            + simulatorService.isContainerSimulationRunning());

        return "{\"state\":" + simulatorService.isContainerSimulationRunning() + "}";
    }


    @ResponseBody
    @RequestMapping(value = "/trucks", method = RequestMethod.POST)
    @Secured(SecurityConstants.ADMIN)
    public void createTrucks(@RequestBody Integer numberOfTrucks) {
        log.info("[POST][/api/trucks] createTrucks(" + numberOfTrucks + ")");
        simulatorService.createTrucks(numberOfTrucks).forEach(truck -> truckService.add(truck));
    }

    @RequestMapping(value = "/trucks/simulate", method = RequestMethod.POST)
    @Secured(SecurityConstants.ADMIN)
    public void simulateTrucks() {
        log.info("[POST][/api/simulator/trucks/simulate] simulateTrucks(), running: ");
        if (simulatorService.isTruckSimulationRunning()) {
            simulatorService.stopTruckSimulation();
        } else {
            simulatorService.startTruckSimulation(DELAY);    // delay in milliseconds
        }
    }

    @ResponseBody
    @RequestMapping(value = "/trucks", method = RequestMethod.GET)
    @Secured(SecurityConstants.ADMIN)
    public String getTrucksSimulatorState() {
        log.info("[GET][/api/simulator/trucks/] getTrucksSimulatorState()");
        return "{\"state\":" + simulatorService.isTruckSimulationRunning() + "}";
    }

    @ResponseBody
    @RequestMapping(value = "/trucks", method = RequestMethod.PUT)
    @Secured(SecurityConstants.ADMIN)
    public void emptyTrucks() {
        log.info("[PUT][/api/trucks] emptyTrucks()");
        truckService.getTrucks().forEach(truck -> {
            truck.setLoad(0);
            truckService.update(truck);
        });
    }


}
