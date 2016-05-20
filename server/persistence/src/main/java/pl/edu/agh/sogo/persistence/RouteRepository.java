package pl.edu.agh.sogo.persistence;

import org.springframework.data.mongodb.repository.MongoRepository;
import pl.edu.agh.sogo.domain.Route;
import pl.edu.agh.sogo.domain.Truck;

public interface RouteRepository extends MongoRepository<Route, String> {
    Route findByTruck(Truck truck);
}
