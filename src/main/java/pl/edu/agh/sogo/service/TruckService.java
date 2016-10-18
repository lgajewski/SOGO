package pl.edu.agh.sogo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.persistence.TruckRepository;
import pl.edu.agh.sogo.service.exceptions.ObjectAlreadyExistsException;
import pl.edu.agh.sogo.service.exceptions.ObjectNotFoundException;
import pl.edu.agh.sogo.service.util.GoogleMapsReverseGeocoder;

import java.util.Collection;

@Service
public class TruckService {

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private GoogleMapsReverseGeocoder googleMapsReverseGeocoder;

    public Collection<Truck> getTrucks() {
        return truckRepository.findAll();
    }

    public Truck findTruckByRegistration(String registration) {
        return truckRepository.findByRegistration(registration);
    }

    public void add(Truck truck) {
        if (truckRepository.findByRegistration(truck.getRegistration()) != null) {
            throw new ObjectAlreadyExistsException("Truck", truck.getRegistration());
        } else {
            try {
                truck.setAddress(googleMapsReverseGeocoder.reverseGeocode(truck.getLocation().getLatitude(), truck.getLocation().getLongitude()));
            } catch (Exception e) {
                e.printStackTrace();
            }

            truckRepository.save(truck);
        }
    }

    public void update(Truck truck) {
        if (truckRepository.findByRegistration(truck.getRegistration()) == null) {
            throw new ObjectNotFoundException("Truck", truck.getRegistration());
        } else {
            try {
                truck.setAddress(googleMapsReverseGeocoder.reverseGeocode(truck.getLocation().getLatitude(), truck.getLocation().getLongitude()));
            } catch (Exception e) {
                e.printStackTrace();
            }
            truckRepository.save(truck);
        }
    }

    public void delete(String registration) {
        Truck truck;
        if ((truck = truckRepository.findByRegistration(registration)) != null) {
            truckRepository.delete(truck);
        }
    }

    public void updateLocation(String registration, Location location) {
        Truck truck;
        if ((truck = truckRepository.findByRegistration(registration)) == null) {
            throw new ObjectNotFoundException("Truck", registration);
        } else {
            truck.setLocation(location);
            try {
                truck.setAddress(googleMapsReverseGeocoder.reverseGeocode(truck.getLocation().getLatitude(), truck.getLocation().getLongitude()));
            } catch (Exception e) {
                e.printStackTrace();
            }
            truckRepository.save(truck);
        }
    }
}
