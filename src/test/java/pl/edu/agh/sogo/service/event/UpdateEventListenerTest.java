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

    @Test
    public void scheduleTrucksGeocode() throws Exception {
        // GIVEN

        // create sample locations
        Location loc1 = new Location(1, 2);
        Location loc2 = new Location(2, 7);
        Location loc3 = new Location(4, 2);

        // create sample trucks
        List<Truck> trucks = new ArrayList<>();
        trucks.add(new Truck("KR 1234", 100));
        trucks.add(new Truck("KRA 456", 80));
        trucks.add(new Truck("KRA 789", 800));

        // assign locations
        trucks.get(0).setLocation(loc1);
        trucks.get(1).setLocation(loc2);
        trucks.get(2).setLocation(loc3);

        // only one with address processed
        trucks.get(1).setAddress("sample address");

        // WHEN
        when(truckService.getTrucks()).thenReturn(trucks);

        updateEventListener.scheduleTrucksGeocode();

        // VERIFY
        verify(geocoder).reverseGeocode(loc1.getLatitude(), loc1.getLongitude());
        verify(geocoder).reverseGeocode(loc3.getLatitude(), loc3.getLongitude());

        verify(truckService).update(trucks.get(0));
        verify(truckService).update(trucks.get(2));
    }

}
