package pl.edu.agh.sogo;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import pl.edu.agh.sogo.service.ITruckService;

import javax.inject.Inject;

import static org.junit.Assert.assertTrue;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = App.class)
@WebAppConfiguration
@IntegrationTest
public class AppTest {

    @Inject
    private ITruckService truckService;

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
