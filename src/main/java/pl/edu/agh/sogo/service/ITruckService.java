package pl.edu.agh.sogo.service;

import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Truck;

import java.util.Collection;

public interface ITruckService {
    Collection<Truck> getTrucks();

    Truck findTruckByRegistration(String registration);

    void add(Truck truck);

    void update(Truck truck);

    void delete(String registration);

    void updateLocation(String registration, Location location);

}
