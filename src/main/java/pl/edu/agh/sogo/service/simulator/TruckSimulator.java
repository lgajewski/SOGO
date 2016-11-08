package pl.edu.agh.sogo.service.simulator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.persistence.TruckRepository;
import pl.edu.agh.sogo.service.TruckService;
import pl.edu.agh.sogo.web.controller.simulator.SimulatorController;

import java.util.List;
import java.util.Random;

@Service
public class TruckSimulator implements Runnable {

    private static final Logger log = LoggerFactory.getLogger(SimulatorService.class);

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private TruckService truckService;

    @Override
    public void run() {
        try {
            log.info("TruckSimulator thread is running");
            Random rand = new Random();
            while(true) {
                synchronized (this) {
                    if (!SimulatorController.isTruckSimulationRunning) {
                        this.wait();
                    }
                }
                List<Truck> trucks = truckRepository.findAll();
                for (Truck truck : trucks) {

                    Location location = new Location(truck.getLocation().getLatitude() + (Math.pow(-1, rand.nextInt()) * 0.002976),
                            truck.getLocation().getLongitude() + (Math.pow(-1, rand.nextInt()) * 0.002976));

                    truckService.updateLocation(truck.getRegistration(), location);

                }
                Thread.sleep(2000);
            }

        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}
