package pl.edu.agh.sogo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Sensor;
import pl.edu.agh.sogo.domain.User;
import pl.edu.agh.sogo.persistence.ContainerRepository;
import pl.edu.agh.sogo.persistence.UserRepository;
import pl.edu.agh.sogo.service.exceptions.ObjectNotFoundException;
import pl.edu.agh.sogo.service.util.GoogleMapsReverseGeocoder;

import java.util.Collection;
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
    private GoogleMapsReverseGeocoder googleMapsReverseGeocoder;

    public List<Container> getContainers() {
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
        Container oldContainer;
        if ((oldContainer = containerRepository.findOne(container.getId())) == null) {
            throw new ObjectNotFoundException("Container", " with device " + container);
        } else {
            try {
                if(container.getLocation() == null){
                    throw new ObjectNotFoundException("Location", container.getId());
                }
                if(Math.abs(oldContainer.getLocation().getLatitude() - container.getLocation().getLatitude()) > 0.0001 || Math.abs(oldContainer.getLocation().getLongitude() - container.getLocation().getLongitude()) > 0.0001){
                    container.setAddress(googleMapsReverseGeocoder.reverseGeocode(container.getLocation().getLatitude(), container.getLocation().getLongitude()));
                } else {
                    container.setAddress(oldContainer.getAddress());
                }

                containerRepository.save(container);
                // emit updated container to browsers that subscribe on SSE
                sseService.emit("container", container);
            } catch (Exception e) {
                e.printStackTrace();
            }
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

    public void repairContainer(String id, String login) {
        List<Container> containers;
        Optional<User> user = userRepository.findOneByLogin(login);
        if (!user.isPresent()) {
            throw new ObjectNotFoundException("User", login);
        } else {
            if ((containers = containerRepository.findAllByRepairer(user.get())) == null) {
                throw new ObjectNotFoundException("Containers", login);
            } else {
                Optional<Container> optionalContainer = containers.stream().filter(c -> c.getId().equals(id)).findFirst();
                if (optionalContainer.isPresent()) {
                    Container container = optionalContainer.get();
                    container.setRepairer(null);
                    container.getSensors().forEach((k, v) -> v.setErrorCode(0));
                    containerRepository.save(container);
                } else {
                    throw new ObjectNotFoundException("Container", id);
                }
            }
        }
    }

    public List<Container> getContainersToRepair(String login){
        Optional<User> user = userRepository.findOneByLogin(login);
        if(user.isPresent()){
            return containerRepository.findAllByRepairer(user.get());
        } else {
            throw new ObjectNotFoundException("User", login);
        }
    }
}
