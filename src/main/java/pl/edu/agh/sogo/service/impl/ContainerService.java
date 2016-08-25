package pl.edu.agh.sogo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Sensor;
import pl.edu.agh.sogo.persistence.ContainerRepository;
import pl.edu.agh.sogo.service.IContainerService;
import pl.edu.agh.sogo.service.exceptions.ObjectNotFoundException;

import java.util.Collection;

@Service
public class ContainerService implements IContainerService {
    @Autowired
    ContainerRepository containerRepository;

    @Override
    public Collection<Container> getContainers() {
        return containerRepository.findAll();
    }

    @Override
    public Container getContainer(String id) {
        return containerRepository.findOne(id);
    }

    @Override
    public void add(Container container) {
        containerRepository.save(container);
    }

    @Override
    public void update(Container container) {
        if (containerRepository.findOne(container.getId()) == null){
            throw new ObjectNotFoundException("Container", " with device " + container);
        } else {
            containerRepository.save(container);
        }
    }

    @Override
    public void delete(String id) {
        Container container;
        if ((container = containerRepository.findOne(id)) != null){
            containerRepository.delete(container);
        }
    }

    @Override
    public void addSensor(String id, String sensorName, Sensor sensor) {
        Container container;
        if ((container = containerRepository.findOne(id)) == null){
            throw new ObjectNotFoundException("Container", id);
        } else {
            container.addSensor(sensorName, sensor);
            containerRepository.save(container);
        }
    }

}
