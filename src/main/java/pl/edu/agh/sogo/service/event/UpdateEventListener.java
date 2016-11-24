package pl.edu.agh.sogo.service.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.service.SseService;
import pl.edu.agh.sogo.service.TruckService;
import pl.edu.agh.sogo.service.geocoder.GoogleMapsReverseGeocoder;

@Component
public class UpdateEventListener implements ApplicationListener<UpdateEvent> {

    private static final int INITIAL_DELAY = 1000;

    /* delay between geocode executions */
    private static final int DELAY = 15000;


    @Autowired
    private SseService sseService;

    @Autowired
    private GoogleMapsReverseGeocoder geocoder;

    @Autowired
    private TruckService truckService;

    @Override
    public void onApplicationEvent(UpdateEvent event) {
        sseService.emit(event.getName(), event.getObject());
    }

    @Scheduled(initialDelay = INITIAL_DELAY, fixedDelay = DELAY)
    public void scheduleTrucksGeocode() {
        truckService.getTrucks().stream()
            .filter(truck -> truck.getAddress() == null)
            .forEach(truck -> {
                Location loc = truck.getLocation();
                truck.setAddress(geocoder.reverseGeocode(loc.getLatitude(), loc.getLongitude()));
                truckService.update(truck);
            });
    }

}
