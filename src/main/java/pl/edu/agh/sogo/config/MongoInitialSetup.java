package pl.edu.agh.sogo.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pl.edu.agh.sogo.domain.Authority;
import pl.edu.agh.sogo.domain.User;
import pl.edu.agh.sogo.persistence.AuthorityRepository;
import pl.edu.agh.sogo.persistence.UserRepository;
import pl.edu.agh.sogo.security.SecurityConstants;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class MongoInitialSetup {

    private static final Logger log = LoggerFactory.getLogger(MongoInitialSetup.class);

    private static final Authority USER_AUTHORITY = new Authority(SecurityConstants.USER);
    private static final Authority SYSTEM_MANAGER_AUTHORITY = new Authority(SecurityConstants.SYSTEM_MANAGER);
    private static final Authority ADMIN_AUTHORITY = new Authority(SecurityConstants.ADMIN);

    private static final Set<Authority> userAuthorities = new HashSet<>(Collections.singletonList(USER_AUTHORITY));
    private static final Set<Authority> systemManagerAuthorities = new HashSet<>(Arrays.asList(USER_AUTHORITY, SYSTEM_MANAGER_AUTHORITY));
    private static final Set<Authority> adminAuthorities = new HashSet<>(Arrays.asList(USER_AUTHORITY, SYSTEM_MANAGER_AUTHORITY, ADMIN_AUTHORITY));

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void initSetup() {
        log.info("Initialize MongoDB configuration");
        addAuthorities();
        addUsers();
    }

    private void addAuthorities() {
        authorityRepository.save(USER_AUTHORITY);
        authorityRepository.save(SYSTEM_MANAGER_AUTHORITY);
        authorityRepository.save(ADMIN_AUTHORITY);
    }

    private void addUsers() {
        User admin = createUser("user-0", "admin", "$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC",
            "admin", "Administrator", "admin@localhost", true, adminAuthorities);
        User manager = createUser("user-1", "manager", "$2a$10$8gBhAGP6pstQxYsyxyH9cukhkj/Ez8pNEj32cwM5fRtwHs4ulCwOC",
            "manager", "Manager", "manager@localhost", true, systemManagerAuthorities);
        User user = createUser("user-2", "user", "$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K",
            "", "User", "user@localhost", true, userAuthorities);

        userRepository.save(admin);
        userRepository.save(manager);
        userRepository.save(user);
    }

    private User createUser(String id, String login, String password, String firstName, String lastName,
                            String email, boolean activated, Set<Authority> authorities) {
        User user = new User();
        user.setId(id);
        user.setLogin(login);
        user.setPassword(password);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setActivated(activated);
        user.setAuthorities(authorities);
        return user;
    }

}
