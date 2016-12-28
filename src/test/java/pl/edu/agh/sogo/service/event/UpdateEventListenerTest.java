package pl.edu.agh.sogo.service.event;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.service.SseService;
import pl.edu.agh.sogo.service.TruckService;
import pl.edu.agh.sogo.service.geocoder.GoogleMapsReverseGeocoder;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.*;

public class UpdateEventListenerTest {

    @Mock
    private SseService sseService;

    @Mock
    private GoogleMapsReverseGeocoder geocoder;

    @Mock
    private TruckService truckService;

    @InjectMocks
    private UpdateEventListener updateEventListener;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        when(geocoder.reverseGeocode(anyDouble(), anyDouble())).thenReturn("address");
    }

    @Test
    public void onApplicationEvent() throws Exception {
        String name = "name";
        Object obj = new Object();

        UpdateEvent updateEvent = new UpdateEvent(this, name, obj);
        updateEventListener.onApplicationEvent(updateEvent);

        verify(sseService).emit(name, obj);
    }

}
