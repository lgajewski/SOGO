package pl.edu.agh.sogo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Sensor;
import pl.edu.agh.sogo.domain.User;
import pl.edu.agh.sogo.persistence.ContainerRepository;
import pl.edu.agh.sogo.persistence.UserRepository;
import pl.edu.agh.sogo.service.exceptions.ObjectNotFoundException;
import pl.edu.agh.sogo.service.geocoder.GoogleMapsReverseGeocoder;

import java.util.List;
import java.util.Optional;

@Service
public class ContainerService {
    @Autowired
    private SseService sseService;

    @Autowired
    private ContainerRepository containerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GoogleMapsReverseGeocoder geocoder;

    public List<Container> getContainers() {
        return containerRepository.findAll();
    }

    public Container getContainer(String id) {
        return containerRepository.findOne(id);
    }

    public void add(Container container) {
        checkGeocode(container);
        containerRepository.save(container);
    }

    public void update(Container container) {
        if (containerRepository.findOne(container.getId()) == null) {
            throw new ObjectNotFoundException("Container", " with device " + container);
        }

        checkGeocode(container);
        containerRepository.save(container);

        // emit updated container to browsers that subscribe on SSE
        sseService.emit("container", container);
    }

    private void checkGeocode(Container container) {
        Location loc = container.getLocation();
        if (loc.getAddress() == null) {
            loc.setAddress(geocoder.reverseGeocode(loc.getLatitude(), loc.getLongitude()));
        }
    }

    public void delete(String id) {
        Container container = containerRepository.findOne(id);
        if (container != null) {
            containerRepository.delete(container);
        }
    }

    public void addSensor(String id, String sensorName, Sensor sensor) {
        Container container = containerRepository.findOne(id);
        if (container == null) {
            throw new ObjectNotFoundException("Container", id);
        }

        container.addSensor(sensorName, sensor);
        containerRepository.save(container);
    }

    public void repairContainer(String id, String login) {
        Optional<User> user = userRepository.findOneByLogin(login);
        if (!user.isPresent()) {
            throw new ObjectNotFoundException("User", login);
        }

        List<Container> containers = containerRepository.findAllByRepairer(user.get());
        if (containers == null) {
            throw new ObjectNotFoundException("Containers", login);
        }

        Optional<Container> optionalContainer = containers.stream().filter(c -> c.getId().equals(id)).findFirst();
        if (!optionalContainer.isPresent()) {
            throw new ObjectNotFoundException("Container", id);
        }

        Container container = optionalContainer.get();
        container.setRepairer(null);
        container.getSensors().forEach((k, v) -> v.setErrorCode(0));
        containerRepository.save(container);
    }

    public List<Container> getContainersToRepair(String login) {
        Optional<User> user = userRepository.findOneByLogin(login);
        if (!user.isPresent()) {
            throw new ObjectNotFoundException("User", login);
        }

        return containerRepository.findAllByRepairer(user.get());
    }
}
