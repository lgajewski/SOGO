package pl.edu.agh.sogo.persistence;

import org.springframework.data.mongodb.repository.MongoRepository;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.domain.security.User;

public interface TruckRepository extends MongoRepository<Truck, String> {
    Truck findByRegistration(String registration);
    Truck findByUser(User user);
}
