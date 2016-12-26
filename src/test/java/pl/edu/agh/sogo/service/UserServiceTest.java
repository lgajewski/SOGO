package pl.edu.agh.sogo.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;
import pl.edu.agh.sogo.domain.Authority;
import pl.edu.agh.sogo.domain.User;
import pl.edu.agh.sogo.persistence.AuthorityRepository;
import pl.edu.agh.sogo.persistence.UserRepository;
import pl.edu.agh.sogo.web.dto.ManagedUserDTO;

import javax.inject.Inject;
import java.util.Collections;
import java.util.HashSet;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

@SuppressWarnings("OptionalGetWithoutIsPresent")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserServiceTest {

    @Inject
    private UserRepository userRepository;

    @Inject
    private UserService userService;

    @Before
    public void setUp() throws Exception {
        userRepository.deleteAll();
    }

    @Test
    public void createUser() throws Exception {
        ManagedUserDTO managedUserDTO = createSampleUserDTO();
        userService.createUser(managedUserDTO);

        assertEquals(managedUserDTO.getLogin(), userService.getUserByLogin("janek").get().getLogin());
        assertTrue(userService.getUserByLogin("janek").get().getAuthorities().size() == 1);
    }

    @Test
    public void updateUser() throws Exception {
        ManagedUserDTO managedUserDTO = createSampleUserDTO();
        User user = userService.createUser(managedUserDTO);

        user.setEmail("other@mail.pl");
        userService.updateUser(user.getLogin(), user.getFirstName(), user.getLastName(), user.getEmail(),
            user.isActivated(), user.getLangKey(), user.getAuthorities().stream().map(Authority::getName).collect(Collectors.toSet()));

        User userUpdated = userService.getUserByLogin("janek").get();
        assertEquals("other@mail.pl", userUpdated.getEmail());
    }

    @Test
    public void deleteUser() throws Exception {
        ManagedUserDTO managedUserDTO = createSampleUserDTO();
        userService.createUser(managedUserDTO);

        userService.deleteUser("janek");
        assertTrue(userService.getAllUsers().isEmpty());
    }

    @Test
    public void activateUser() throws Exception {
        ManagedUserDTO managedUserDTO = createSampleUserDTO();
        userService.createUser(managedUserDTO);

        userService.activateUser("janek");
        assertTrue(userService.getUserByLogin("janek").get().isActivated());
    }

    @Test
    public void deactivateUser() throws Exception {
        ManagedUserDTO managedUserDTO = createSampleUserDTO();
        userService.createUser(managedUserDTO);

        userService.activateUser("janek");
        userService.deactivateUser("janek");
        assertFalse(userService.getUserByLogin("janek").get().isActivated());
    }

    @Test
    public void changePassword() throws Exception {
        ManagedUserDTO managedUserDTO = createSampleUserDTO();
        userService.createUser(managedUserDTO);

        assertTrue(userService.isPasswordValid("janek", "pass"));
        userService.changePassword("janek", "pass2");
        assertFalse(userService.isPasswordValid("janek", "pass"));
        assertTrue(userService.isPasswordValid("janek", "pass2"));
    }

    private ManagedUserDTO createSampleUserDTO() {
        ManagedUserDTO managedUserDTO = new ManagedUserDTO();
        managedUserDTO.setPassword("pass");
        managedUserDTO.setActivated(true);
        managedUserDTO.setAuthorities(new HashSet<>(Collections.singletonList("ROLE_ADMIN")));
        managedUserDTO.setLogin("janek");
        managedUserDTO.setFirstName("jan");
        managedUserDTO.setLangKey("kowalski");
        managedUserDTO.setEmail("jan@kowal.pl");
        managedUserDTO.setLangKey("PL");
        return managedUserDTO;
    }

}
