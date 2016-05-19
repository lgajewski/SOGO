package pl.edu.agh.sogo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.persistence.TruckRepository;
import pl.edu.agh.sogo.service.ITruckService;
import pl.edu.agh.sogo.service.exceptions.TruckAlreadyExistsException;
import pl.edu.agh.sogo.service.exceptions.TruckNotFoundException;

import java.util.Collection;

@Service
public class TruckService implements ITruckService {

    @Autowired
    TruckRepository truckRepository;

    @Override
    public Collection<Truck> getTrucks() {
        return truckRepository.findAll();
    }

    @Override
    public Truck findTruckByRegistration(String registration) {
        return truckRepository.findByRegistration(registration);
    }

    @Override
    public void add(Truck truck) {
        if (truckRepository.findByRegistration(truck.getRegistration()) != null){
            throw new TruckAlreadyExistsException(truck.getRegistration());
        } else {
            truckRepository.save(truck);
        }
    }

    @Override
    public void update(Truck truck) {
        if (truckRepository.findByRegistration(truck.getRegistration()) == null){
            throw new TruckNotFoundException(truck.getRegistration());
        } else {
            truckRepository.save(truck);
        }
    }

    @Override
    public void delete(String registration) {
        Truck truck;
        if ((truck =truckRepository.findByRegistration(registration)) != null){
            truckRepository.delete(truck);
        }
    }

    @Override
    public void updateLocation(String registration, Location location) {
        Truck truck;
        if ((truck = truckRepository.findByRegistration(registration)) == null){
            throw new TruckNotFoundException(registration);
        } else {
            truck.setLocation(location);
            truckRepository.save(truck);
        }
    }
}
