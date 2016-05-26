package pl.edu.agh.sogo.application.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.domain.security.User;
import pl.edu.agh.sogo.service.IUserService;

import java.util.Collection;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private IUserService userService;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET)
    public Collection<User> getUsers() {
        return userService.getUsers();
    }

    @ResponseBody
    @RequestMapping(value = "/{username}", method = RequestMethod.GET)
    public User getUser(@PathVariable(value = "username") String username) {
        return userService.findUserByUsername(username);
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.PUT)
    public void updateUser(@RequestBody User user) {
        userService.update(user);
        return;
    }

    @ResponseBody
    @RequestMapping(value = "/{username}/enable", method = RequestMethod.POST)
    public void enableUser(@PathVariable(value = "username") String username) {
        userService.enable(username);
    }

    @ResponseBody
    @RequestMapping(value = "/{username}/disable", method = RequestMethod.POST)
    public void disableUser(@PathVariable(value = "username") String username) {
        userService.disable(username);
    }

}

