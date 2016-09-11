package pl.edu.agh.sogo;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import pl.edu.agh.sogo.service.TruckService;

import javax.inject.Inject;

import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AppTest {

    @Inject
    private TruckService truckService;

    @Before
    public void setUp() throws Exception {
        // setUp method
    }

    @After
    public void tearDown() throws Exception {
        // tearDown method
    }

    @Test
    public void testSample() {
        // sample test
        assertTrue(truckService.getTrucks().size() >= 0);
    }

}
