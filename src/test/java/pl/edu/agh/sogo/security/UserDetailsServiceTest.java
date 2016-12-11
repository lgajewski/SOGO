package pl.edu.agh.sogo.security;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.junit4.SpringRunner;
import pl.edu.agh.sogo.domain.Authority;
import pl.edu.agh.sogo.domain.User;
import pl.edu.agh.sogo.persistence.AuthorityRepository;
import pl.edu.agh.sogo.security.UserDetailsService;
import pl.edu.agh.sogo.service.UserService;
import pl.edu.agh.sogo.web.dto.ManagedUserDTO;

import javax.inject.Inject;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserDetailsServiceTest {

    private static final String LOGIN = "test";

    @Inject
    private UserService userService;

    @Inject
    private AuthorityRepository authorityRepository;

    @Inject
    private UserDetailsService userDetailsService;

    @Before
    public void setUp() {
        userService.deleteUser(LOGIN);
    }

    @Test(expected = UsernameNotFoundException.class)
    public void loadUserWhenNotFound() throws Exception {
        userDetailsService.loadUserByUsername(LOGIN);
    }

    @Test(expected = UserDetailsService.UserNotActivatedException.class)
    public void loadUserWhenNotActivated() throws Exception {
        ManagedUserDTO dto = createDTO(LOGIN, "localhost@localhost", Collections.emptySet());
        userService.createUser(dto);

        userDetailsService.loadUserByUsername(LOGIN);
    }

    @Test
    public void loadUserByUsername() throws Exception {
        ManagedUserDTO dto = createDTO(LOGIN, "localhost@localhost", Collections.emptySet());
        userService.createUser(dto);
        userService.activateUser(LOGIN);

        UserDetails userDetails = userDetailsService.loadUserByUsername(LOGIN);

        assertEquals(LOGIN, userDetails.getUsername());
        assertTrue(userDetails.getAuthorities().isEmpty());
        assertTrue(userDetails.isEnabled());
        assertTrue(userDetails.isAccountNonExpired());
        assertTrue(userDetails.isAccountNonLocked());
    }


    @Test
    public void loadUserByUsernameWithAuthorities() throws Exception {
        List<Authority> authorities = authorityRepository.findAll();

        ManagedUserDTO dto = createDTO(LOGIN, "localhost@localhost", new HashSet<>(authorities));
        userService.createUser(dto);
        userService.activateUser(LOGIN);

        UserDetails userDetails = userDetailsService.loadUserByUsername(LOGIN);

        assertEquals(LOGIN, userDetails.getUsername());
        assertTrue(userDetails.isEnabled());
        assertTrue(userDetails.isAccountNonExpired());
        assertTrue(userDetails.isAccountNonLocked());

        assertEquals(authorities.size(), userDetails.getAuthorities().size());

        List<String> actual = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        assertTrue(actual.containsAll(authorities.stream().map(Authority::getName).collect(Collectors.toList())));
    }

    private ManagedUserDTO createDTO(String login, String email, Set<Authority> authorities) {
        User user = new User();
        user.setLogin(login);
        user.setEmail(email);
        user.setAuthorities(authorities);

        ManagedUserDTO dto = new ManagedUserDTO(user);
        dto.setPassword("123asd123");

        return dto;
    }

}
