package pl.edu.agh.sogo.integration;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import pl.edu.agh.sogo.domain.Authority;
import pl.edu.agh.sogo.domain.User;
import pl.edu.agh.sogo.persistence.AuthorityRepository;
import pl.edu.agh.sogo.persistence.UserRepository;
import pl.edu.agh.sogo.security.SecurityConstants;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MongoInitialSetupTest {

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private UserRepository userRepository;

    @Before
    public void setUp() throws Exception {
        // setUp method
    }

    @After
    public void tearDown() throws Exception {
        // tearDown method
    }

    @Test
    public void testAuthoritiesExist() {
        List<String> expectedRoles = Arrays.asList(
            SecurityConstants.USER,
            SecurityConstants.SYSTEM_MANAGER,
            SecurityConstants.ADMIN
        );

        List<String> authorities = authorityRepository.findAll()
            .stream().map(Authority::getName).collect(Collectors.toList());

        assertEquals(expectedRoles.size(), authorities.size());
        assertTrue(authorities.containsAll(expectedRoles));
    }


    @Test
    public void testUsersExist() {
        List<String> expectedLogins = Arrays.asList(
            "admin",
            "manager",
            "user"
        );

        List<String> users = userRepository.findAll()
            .stream().map(User::getLogin).collect(Collectors.toList());

        assertTrue(users.size() >= expectedLogins.size());
        assertTrue(users.containsAll(expectedLogins));
    }

}
