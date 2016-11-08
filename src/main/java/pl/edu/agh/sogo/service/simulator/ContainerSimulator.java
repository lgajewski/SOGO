package pl.edu.agh.sogo.service.simulator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Sensor;
import pl.edu.agh.sogo.persistence.ContainerRepository;
import pl.edu.agh.sogo.service.ContainerService;
import pl.edu.agh.sogo.web.controller.simulator.SimulatorController;

import java.util.List;
import java.util.Random;
@Service
public class ContainerSimulator implements Runnable {

    @Autowired
    private ContainerService containerService;

    @Autowired
    private ContainerRepository containerRepository;

    @Override
    public void run() {
        try {
            Random rand = new Random();
            while(true) {
                synchronized (this) {
                    if (!SimulatorController.isContainerSimulationRunning) {
                        this.wait();
                    }
                }

                List<Container> containers = containerRepository.findAll();
                for (Container container : containers) {

                    for (String sensorType : container.getSensors().keySet()) {
                        Sensor sensor = container.getSensors().get(sensorType);
                        if (sensorType.equalsIgnoreCase("device")) {
                            if (Double.parseDouble(sensor.getValue().toString()) <= 99) {
                                sensor.setValue((int) (Double.parseDouble(sensor.getValue().toString()) + 1));
                            }
                        } else {
                            double rn = rand.nextDouble();
                            if (Double.parseDouble(sensor.getValue().toString()) + rn < 100.0) {
                                sensor.setValue(Double.parseDouble(sensor.getValue().toString()) + rn);
                            }
                        }
                    }
                    containerService.update(container);

                }
                Thread.sleep(2000);
            }

        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}
