package pl.edu.agh.sogo.persistence;

import org.springframework.data.mongodb.repository.MongoRepository;
import pl.edu.agh.sogo.domain.Device;

public interface DeviceRepository extends MongoRepository<Device, String>  {
}
