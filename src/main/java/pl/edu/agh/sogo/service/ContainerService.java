package pl.edu.agh.sogo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Sensor;
import pl.edu.agh.sogo.persistence.ContainerRepository;
import pl.edu.agh.sogo.service.exceptions.ObjectNotFoundException;
import pl.edu.agh.sogo.service.util.GoogleMapsReverseGeocoder;

import java.util.Collection;

@Service
public class ContainerService {
    @Autowired
    private SseService sseService;

    @Autowired
    private ContainerRepository containerRepository;

    @Autowired
    private GoogleMapsReverseGeocoder googleMapsReverseGeocoder;

    public Collection<Container> getContainers() {
        return containerRepository.findAll();
    }

    public Container getContainer(String id) {
        return containerRepository.findOne(id);
    }

    public void add(Container container) {
        try {
            container.setAddress(googleMapsReverseGeocoder.reverseGeocode(container.getLocation().getLatitude(), container.getLocation().getLongitude()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        containerRepository.save(container);
    }

    public void update(Container container) {
        if (containerRepository.findOne(container.getId()) == null) {
            throw new ObjectNotFoundException("Container", " with device " + container);
        } else {
            try {
                container.setAddress(googleMapsReverseGeocoder.reverseGeocode(container.getLocation().getLatitude(), container.getLocation().getLongitude()));
            } catch (Exception e) {
                e.printStackTrace();
            }
            containerRepository.save(container);
            // emit updated container to browsers that subscribe on SSE
            sseService.emit("container", container);
        }
    }

    public void delete(String id) {
        Container container;
        if ((container = containerRepository.findOne(id)) != null) {
            containerRepository.delete(container);
        }
    }

    public void addSensor(String id, String sensorName, Sensor sensor) {
        Container container;
        if ((container = containerRepository.findOne(id)) == null) {
            throw new ObjectNotFoundException("Container", id);
        } else {
            container.addSensor(sensorName, sensor);
            containerRepository.save(container);
        }
    }
}
