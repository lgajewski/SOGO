package pl.edu.agh.sogo.service;

import org.apache.commons.lang.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.User;
import pl.edu.agh.sogo.persistence.AuthorityRepository;
import pl.edu.agh.sogo.persistence.UserRepository;
import pl.edu.agh.sogo.web.dto.ManagedUserDTO;

import javax.inject.Inject;
import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service class for managing users.
 */
@Service
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    @Inject
    private PasswordEncoder passwordEncoder;

    @Inject
    private UserRepository userRepository;

    @Inject
    private AuthorityRepository authorityRepository;

    public User createUser(ManagedUserDTO managedUserDTO) {
        User user = new User();
        user.setLogin(managedUserDTO.getLogin());
        user.setFirstName(managedUserDTO.getFirstName());
        user.setLastName(managedUserDTO.getLastName());
        user.setEmail(managedUserDTO.getEmail());
        user.setLangKey(managedUserDTO.getLangKey());
        user.setAuthorities(managedUserDTO.getAuthorities().stream()
            .map(authorityName -> authorityRepository.findOne(authorityName))
            .filter(Objects::nonNull)
            .collect(Collectors.toSet()));

        user.setPassword(passwordEncoder.encode(managedUserDTO.getPassword()));
        user.setResetKey(generateResetKey());
        user.setResetDate(System.currentTimeMillis());
        user.setActivated(false);
        userRepository.save(user);
        log.debug("Created Information for User: {}", user);
        return user;
    }

    public void updateUser(String login, String firstName, String lastName, String email,
                           boolean activated, String langKey, Set<String> authorities) {
        userRepository
            .findOneByLogin(login)
            .ifPresent(u -> {
                u.setLogin(login);
                u.setFirstName(firstName);
                u.setLastName(lastName);
                u.setEmail(email);
                u.setActivated(activated);
                u.setLangKey(langKey);
                u.setAuthorities(Optional.ofNullable(authorities).orElse(new HashSet<>())
                    .stream()
                    .map(authority -> authorityRepository.findOne(authority))
                    .collect(Collectors.toSet()));

                userRepository.save(u);
                log.debug("Changed Information for User: {}", u);
            });
    }

    public void deleteUser(String login) {
        userRepository.findOneByLogin(login).ifPresent(u -> {
            userRepository.delete(u);
            log.debug("Deleted User: {}", u);
        });
    }

    public void activateUser(String login) {
        userRepository.findOneByLogin(login)
            .ifPresent(user -> {
                user.setActivated(true);
                userRepository.save(user);
                log.debug("Activated user: {}", user);
            });
    }

    public void deactivateUser(String login) {
        userRepository.findOneByLogin(login)
            .ifPresent(user -> {
                user.setActivated(false);
                userRepository.save(user);
                log.debug("Activated user: {}", user);
            });
    }

    public Optional<User> getUserByLogin(String login) {
        return userRepository.findOneByLogin(login);
    }

    public User getUserById(String id) {
        return userRepository.findOne(id);
    }

    public void changePassword(String login, String password) {
        userRepository.findOneByLogin(login).ifPresent(u -> {
            String encryptedPassword = passwordEncoder.encode(password);
            u.setPassword(encryptedPassword);
            userRepository.save(u);
            log.debug("Changed password for User: {}", u);
        });
    }

    public boolean isPasswordValid(String login, String password) {
        return userRepository.findOneByLogin(login)
            .map(user -> passwordEncoder.matches(password, user.getPassword()))
            .orElse(false);
    }

    public Optional<User> requestPasswordReset(String mail) {
        return userRepository.findOneByEmail(mail)
            .filter(User::isActivated)
            .map(user -> {
                user.setResetKey(generateResetKey());
                user.setResetDate(System.currentTimeMillis());
                userRepository.save(user);
                return user;
            });
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
        log.debug("Reset user password for reset key {}", key);

        return userRepository.findOneByResetKey(key)
            .map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetKey(null);
                user.setResetDate(0);
                userRepository.save(user);
                return user;
            });
    }

    private static String generateResetKey() {
        return RandomStringUtils.randomNumeric(20);
    }
}
