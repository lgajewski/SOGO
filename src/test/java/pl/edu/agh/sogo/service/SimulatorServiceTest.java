package pl.edu.agh.sogo.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.test.context.junit4.SpringRunner;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Sensor;
import pl.edu.agh.sogo.domain.Truck;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyLong;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SimulatorServiceTest {

    @Mock
    private TruckService truckService;

    @Mock
    private ContainerService containerService;

    @Mock
    private TaskScheduler scheduler;

    @Mock
    private ScheduledFuture scheduledFuture;

    @Captor
    private ArgumentCaptor<Runnable> captor;

    @InjectMocks
    private SimulatorService simulatorService;

    @Before
    @SuppressWarnings("unchecked")
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        when(scheduler.scheduleWithFixedDelay(any(Runnable.class), anyLong()))
            .thenReturn(scheduledFuture);
    }

    @Test
    public void testTruckSimulation() {
        List<Truck> trucks = Stream.generate(this::provideTruckMock)
            .limit(10)
            .collect(Collectors.toList());
        when(truckService.getTrucks()).thenReturn(trucks);

        // simulation should be stopped by default
        assertFalse(simulatorService.isTruckSimulationRunning());

        long delay = 1000;
        simulatorService.startTruckSimulation(delay);

        // should be running right now
        assertTrue(simulatorService.isTruckSimulationRunning());

        // verify correctness of TruckSimulation
        verify(scheduler).scheduleWithFixedDelay(captor.capture(), eq(delay));

        // simulate scheduler behaviour
        captor.getValue().run();

        verify(truckService, times(10)).updateLocation(eq("ABC"), any(Location.class));
    }

    private Truck provideTruckMock() {
        Truck truck = mock(Truck.class);
        when(truck.getLocation()).thenReturn(new Location(50, 20));
        when(truck.getRegistration()).thenReturn("ABC");
        return truck;
    }

    @Test
    public void testContainerSimulation() {
        List<Container> containers = Stream.generate(this::provideContainerMock)
            .limit(5)
            .collect(Collectors.toList());
        when(containerService.getContainers()).thenReturn(containers);

        // simulation should be stopped by default
        assertFalse(simulatorService.isContainerSimulationRunning());

        long delay = 1000;
        simulatorService.startContainerSimulation(delay);

        // should be running right now
        assertTrue(simulatorService.isContainerSimulationRunning());

        // verify correctness of TruckSimulation
        verify(scheduler).scheduleWithFixedDelay(captor.capture(), eq(delay));

        // simulate scheduler behaviour
        captor.getValue().run();

        ArgumentCaptor<Container> containerCaptor = ArgumentCaptor.forClass(Container.class);
        verify(containerService, times(5)).update(containerCaptor.capture());

        // assert that every value has increased
        containerCaptor.getAllValues().forEach(container ->
            assertTrue((double) container.getSensors().get("load").getValue() > 5.2)
        );
    }

    private Container provideContainerMock() {
        Sensor<Double> sensor = new Sensor<>();
        sensor.setValue(5.2);
        sensor.setErrorCode(0);

        Map<String, Sensor> sensors = new HashMap<>();
        sensors.put("load", sensor);

        Container container = mock(Container.class);
        when(container.getSensors()).thenReturn(sensors);

        return container;
    }

}
