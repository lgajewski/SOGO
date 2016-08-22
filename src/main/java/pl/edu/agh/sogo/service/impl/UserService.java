package pl.edu.agh.sogo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.security.User;
import pl.edu.agh.sogo.persistence.security.UserRepository;
import pl.edu.agh.sogo.service.IUserService;
import pl.edu.agh.sogo.service.exceptions.ObjectNotFoundException;

import java.util.Collection;

@Service
public class UserService implements IUserService{
    @Autowired
    private UserRepository userRepository;

    @Override
    public Collection<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public void update(User user) throws ObjectNotFoundException {
        if (userRepository.findByEmail(user.getEmail()) == null) {
            throw new ObjectNotFoundException("User", user.getEmail());
        }
        userRepository.save(user);
    }

    @Override
    public User getUser(String username) {
        final User user = userRepository.findByUsername(username);
        return user;
    }

    @Override
    public void saveRegisteredUser(User user) {
        userRepository.save(user);
    }

    @Override
    public void delete(User user) {
        userRepository.delete(user);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User findUserByUsername(String username) {
        final User user = userRepository.findByUsername(username);
        return user;
    }


    @Override
    public User getUserByID(String id) {
        return userRepository.findOne(id);
    }

    @Override
    public void enable(String username) {
        User user = userRepository.findByUsername(username);
        if(user == null){
            throw new ObjectNotFoundException("User", username);
        }
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Override
    public void disable(String username) {
        User user = userRepository.findByUsername(username);
        if(user == null){
            throw new ObjectNotFoundException("User", username);
        }
        user.setEnabled(false);
        userRepository.save(user);
    }
}
