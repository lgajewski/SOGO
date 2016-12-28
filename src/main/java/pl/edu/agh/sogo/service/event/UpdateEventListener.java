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

    @Autowired
    private SseService sseService;

    @Override
    public void onApplicationEvent(UpdateEvent event) {
        sseService.emit(event.getName(), event.getObject());
    }

}
