package pl.edu.agh.sogo.web.controller.simulator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.service.ContainerService;
import pl.edu.agh.sogo.service.TruckService;
import pl.edu.agh.sogo.service.simulator.ContainerSimulator;
import pl.edu.agh.sogo.service.simulator.SimulatorService;
import pl.edu.agh.sogo.service.simulator.TruckSimulator;

import javax.annotation.PostConstruct;
import java.util.List;

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



    public static Boolean isTruckSimulationRunning;
    public static Boolean isContainerSimulationRunning;

    private Thread truckSimulatorThread;
    private Thread containerSimulatorThread;
    @Autowired
    TruckSimulator truckSimulator;

    @Autowired
    ContainerSimulator containerSimulator;

    @PostConstruct
    public void initController(){
        isTruckSimulationRunning = false;
        truckSimulatorThread = new Thread(truckSimulator);
        truckSimulatorThread.start();

        isContainerSimulationRunning = false;
        containerSimulatorThread = new Thread(containerSimulator);
        containerSimulatorThread.start();
        log.info("SimulatorController initialized()");
    }



    @ResponseBody
    @RequestMapping(value = "/containers", method = RequestMethod.POST)
    public void createContainers(@RequestBody Integer numberOfContainers){
        List<Container> containers = simulatorService.createContainers(numberOfContainers);
        for (Container container : containers){
            containerService.add(container);
        }
    }

    @ResponseBody
    @RequestMapping(value = "/containers/simulate", method = RequestMethod.POST)
    public void simulateContainers(){
            if (!isContainerSimulationRunning) {
                if(containerSimulatorThread.getState().name().equalsIgnoreCase("terminated")){
                    containerSimulatorThread = new Thread(containerSimulator);
                    containerSimulatorThread.start();
                } else {
                    isContainerSimulationRunning = !isContainerSimulationRunning;
                    synchronized (containerSimulator) {
                        containerSimulator.notify();
                    }
                }
            } else {
                isContainerSimulationRunning = !isContainerSimulationRunning;
            }

    }

    @ResponseBody
    @RequestMapping(value = "/containers", method = RequestMethod.GET)
    public String getContainersSimulatorState(){
        log.info("[GET][/api/simulator/trucks/] getContainersSimulatorState() returned " + isContainerSimulationRunning);
        return "{\"state\":"+isContainerSimulationRunning+"}";
    }

    @ResponseBody
    @RequestMapping(value = "/trucks", method = RequestMethod.POST)
    public void createTrucks(@RequestBody Integer numberOfTrucks){
        List<Truck> trucks = simulatorService.createTrucks(numberOfTrucks);
        for(Truck truck : trucks){
            truckService.add(truck);
        }
    }

    @ResponseBody
    @RequestMapping(value = "/trucks/simulate", method = RequestMethod.POST)
    public void simulateTrucks(){
        log.info("[POST][/api/simulator/trucks/simulate] simulateTrucks()");
        log.info(truckSimulatorThread.getState().name());
            if (!isTruckSimulationRunning) {
                isTruckSimulationRunning = !isTruckSimulationRunning;
                if(truckSimulatorThread.getState().name().equalsIgnoreCase("terminated")){
                    truckSimulatorThread = new Thread(truckSimulator);
                    truckSimulatorThread.start();
                } else {
                    synchronized (truckSimulator) {
                        truckSimulator.notify();
                    }
                }

            } else {
                isTruckSimulationRunning = !isTruckSimulationRunning;
            }

    }

    @ResponseBody
    @RequestMapping(value = "/trucks", method = RequestMethod.GET)
    public String getTrucksSimulatorState(){
        log.info("[GET][/api/simulator/trucks/] getTrucksSimulatorState() returned " + isTruckSimulationRunning);
        return "{\"state\":"+isTruckSimulationRunning+"}";
    }



}
