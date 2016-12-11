package pl.edu.agh.sogo.service;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Sensor;
import pl.edu.agh.sogo.persistence.ContainerRepository;
import pl.edu.agh.sogo.service.exceptions.ObjectNotFoundException;

import javax.inject.Inject;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ContainerServiceTest {

    @Inject
    private ContainerService containerService;

    @Inject
    private ContainerRepository containerRepository;

    @Inject
    private UserService userService;

    @Before
    @After
    public void clear() {
        containerRepository.deleteAll();
    }

    @Test(expected = ObjectNotFoundException.class)
    public void testUpdateIfNotExist() {
        Container container = createSampleContainer();

        containerService.add(container);
        containerService.delete(container.getId());

        containerService.update(container);
    }

    @Test
    public void testUpdate() {
        Container container = createSampleContainer();
        containerService.add(container);
    }

    @Test
    public void testGeocoding() {
        Container container = createSampleContainer();
        containerService.add(container);

        String address = container.getAddress();
        assertNotNull(address);

        container.setLocation(new Location(51, 21));

        containerService.update(container);

        // address should change after update
        assertNotNull(container.getAddress());
        assertNotEquals(address, container.getAddress());
    }

    @Test
    public void testAddingSensors() {
        Container container = createSampleContainer();
        containerService.add(container);

        Sensor<Integer> sensor1 = new Sensor<>();
        sensor1.setErrorCode(0);
        sensor1.setValue(2);

        Sensor<Double> sensor2 = new Sensor<>();
        sensor2.setErrorCode(1);
        sensor2.setValue(3d);

        containerService.addSensor(container.getId(), "first", sensor1);
        containerService.addSensor(container.getId(), "second", sensor2);

        Container actual = containerService.getContainer(container.getId());

        assertEquals(2, actual.getSensors().size());
        assertEquals(0, actual.getSensors().get("first").getErrorCode());
        assertEquals(2, actual.getSensors().get("first").getValue());
        assertEquals(1, actual.getSensors().get("second").getErrorCode());
        assertEquals(3d, actual.getSensors().get("second").getValue());
    }

    @Test
    public void testRepairingContainer() {
        Container container = createSampleContainer();
        containerService.add(container);

        containerService.repairContainer(container.getId(), "admin");

        Container actual = containerService.getContainer(container.getId());
        assertNull(actual.getRepairer());
        assertTrue(actual.getSensors().values().stream().allMatch(sensor -> sensor.getErrorCode() == 0));
    }

    @Test
    public void testFindingContainersToRepair() {
        List<Container> containers = Arrays.asList(
            createSampleContainer(),
            createSampleContainer(),
            createSampleContainer(),
            createSampleContainer());

        // only that container doesn't have repairer
        containers.get(1).setRepairer(null);

        // save all
        containers.forEach(container -> containerService.add(container));

        // check for other user
        assertTrue(containerService.getContainersToRepair("user").isEmpty());

        List<Container> containersToRepair = containerService.getContainersToRepair("admin");
        assertEquals(3, containersToRepair.size());
    }

    private Container createSampleContainer() {
        Container container = new Container();
        container.setCapacity(50);
        container.setLocation(new Location(50, 20));
        container.setRepairer(userService.getUserByLogin("admin").orElseThrow(AssertionError::new));
        container.setType("green");
        return container;
    }

}
