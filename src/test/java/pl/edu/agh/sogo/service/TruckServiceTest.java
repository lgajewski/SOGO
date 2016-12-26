package pl.edu.agh.sogo.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.persistence.TruckRepository;
import pl.edu.agh.sogo.service.exceptions.ObjectAlreadyExistsException;
import pl.edu.agh.sogo.service.exceptions.ObjectNotFoundException;

import javax.inject.Inject;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TruckServiceTest {

    @Inject
    private TruckRepository truckRepository;

    @Inject
    private UserService userService;

    @Inject
    private TruckService truckService;

    @Before
    public void setUp() {
        truckRepository.deleteAll();
    }

    @Test(expected = ObjectNotFoundException.class)
    public void testFindByUserIfNotExist() {
        Truck truck = createSampleTruck();
        truckService.add(truck);
        truckService.findTruckByUser("invalid-login");
    }

    @Test
    public void testFindByUser() {
        Truck truck = createSampleTruck();
        truck.setUser(userService.getUserByLogin("admin").orElseThrow(AssertionError::new));
        truckService.add(truck);

        Truck truckFound = truckService.findTruckByUser("admin");
        assertEquals(truck.getRegistration(), truckFound.getRegistration());
    }

    @Test
    public void testGetTrucks() {
        Truck truck1 = createSampleTruck();
        Truck truck2 = createSampleTruck();
        Truck truck3 = createSampleTruck();
        truck1.setRegistration("KR 12345");
        truck2.setRegistration("KR 12346");
        truck3.setRegistration("KR 12347");

        truckService.add(truck1);
        truckService.add(truck2);
        truckService.add(truck3);

        assertEquals(3, truckService.getTrucks().size());
        assertNotNull(truckService.findTruckByRegistration("KR 12345"));
        assertNotNull(truckService.findTruckByRegistration("KR 12346"));
        assertNotNull(truckService.findTruckByRegistration("KR 12347"));
    }

    @Test(expected = ObjectAlreadyExistsException.class)
    public void testAddTruckMultipleTimes() {
        Truck truck = createSampleTruck();

        truckService.add(truck);
        truckService.add(truck);
    }

    @Test
    public void testUpdate() {
        Truck truck = createSampleTruck();
        truckService.add(truck);

        truck.setCapacity(123);
        truckService.update(truck);

        assertEquals(123, truckService.findTruckByRegistration("KR 123").getCapacity());
    }

    @Test
    public void testDelete() {
        Truck truck = createSampleTruck();
        truckService.add(truck);

        truckService.delete(truck.getRegistration());

        assertNull(truckService.findTruckByRegistration(truck.getRegistration()));
    }

    @Test
    public void testUpdateLocation() {
        Truck truck = createSampleTruck();
        truck.setAddress("some address");
        truckService.add(truck);

        Location newLocation = new Location(51, 21);
        truckService.updateLocation(truck.getRegistration(), newLocation);

        Truck truckFound = truckService.findTruckByRegistration(truck.getRegistration());

        assertEquals(newLocation, truckFound.getLocation());
        assertNull(truckFound.getAddress());
    }


    private Truck createSampleTruck() {
        Truck truck = new Truck();
        truck.setCapacity(50);
        truck.setLocation(new Location(50, 20));
        truck.setRegistration("KR 123");
        return truck;
    }

}
