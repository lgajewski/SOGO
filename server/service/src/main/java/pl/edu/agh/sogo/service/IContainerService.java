package pl.edu.agh.sogo.service;

import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Sensor;

import java.util.Collection;

public interface IContainerService {
    Collection<Container> getContainers();

    Container getContainer(String id);

    void add(Container container);

    void update(Container container);

    void delete(String id);

    void addSensor(String id, Sensor sensor);
}
