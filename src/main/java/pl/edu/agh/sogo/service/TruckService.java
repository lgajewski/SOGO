package pl.edu.agh.sogo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.domain.User;
import pl.edu.agh.sogo.persistence.TruckRepository;
import pl.edu.agh.sogo.persistence.UserRepository;
import pl.edu.agh.sogo.service.event.UpdateEvent;
import pl.edu.agh.sogo.service.exceptions.ObjectAlreadyExistsException;
import pl.edu.agh.sogo.service.exceptions.ObjectNotFoundException;
import pl.edu.agh.sogo.service.geocoder.GoogleMapsReverseGeocoder;

import java.util.List;
import java.util.Optional;

@Service
public class TruckService {

    private static final int INITIAL_DELAY = 1000;

    /* delay between geocode executions */
    private static final int DELAY = 15000;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GoogleMapsReverseGeocoder geocoder;

    public List<Truck> getTrucks() {
        return truckRepository.findAll();
    }

    public Truck findTruckByRegistration(String registration) {
        return truckRepository.findByRegistration(registration);
    }

    public Truck findTruckByUser(String login) {
        Optional<User> user = userRepository.findOneByLogin(login);
        if (!user.isPresent()) {
            throw new ObjectNotFoundException("User", login);
        } else {
            return truckRepository.findByUser(user.get());
        }
    }

    public void add(Truck truck) {
        if (truckRepository.findByRegistration(truck.getRegistration()) != null) {
            throw new ObjectAlreadyExistsException("Truck", truck.getRegistration());
        }

        truckRepository.save(truck);
    }

    public void update(Truck truck) {
        if (truckRepository.findByRegistration(truck.getRegistration()) == null) {
            throw new ObjectNotFoundException("Truck", truck.getRegistration());
        }

        truckRepository.save(truck);

        // publish events
        eventPublisher.publishEvent(new UpdateEvent(this, "truck", truck));
    }

    public void delete(String registration) {
        Truck truck = truckRepository.findByRegistration(registration);
        if (truck != null) {
            truckRepository.delete(truck);
        }
    }

    public void updateLocation(String registration, Location location) {
        Truck truck = truckRepository.findByRegistration(registration);
        if (truck == null) {
            throw new ObjectNotFoundException("Truck", registration);
        }

        truck.setLocation(location);
        truck.setAddress(null);
        update(truck);
    }

    @Scheduled(initialDelay = INITIAL_DELAY, fixedDelay = DELAY)
    public void scheduleTrucksGeocode() {
        getTrucks().stream()
            .filter(truck -> truck.getAddress() == null)
            .forEach(truck -> {
                Location loc = truck.getLocation();
                truck.setAddress(geocoder.reverseGeocode(loc.getLatitude(), loc.getLongitude()));
                update(truck);
            });
    }
}
