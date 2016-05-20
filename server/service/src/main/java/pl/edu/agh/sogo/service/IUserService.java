package pl.edu.agh.sogo.service;

import pl.edu.agh.sogo.domain.security.User;
import pl.edu.agh.sogo.service.exceptions.ObjectNotFoundException;

import java.util.Collection;

public interface IUserService {
    Collection<User> getUsers();

    void update(User user) throws ObjectNotFoundException;

    User getUser(String username);

    void saveRegisteredUser(User user);

    void delete(User user);

    User findUserByEmail(String email);

    User findUserByUsername(String username);

    User getUserByID(String id);

    void enable(String username);

    void disable(String username);
}
