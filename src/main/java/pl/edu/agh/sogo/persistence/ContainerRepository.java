package pl.edu.agh.sogo.persistence;

import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Device;

import java.util.List;

public interface ContainerRepository extends MongoRepository<Container, String> {
    Container findByDevice(Device device);
    List<Container> findByLocationNear(Point point);
}
