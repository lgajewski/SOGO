package pl.edu.agh.sogo.application.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Collection<User>> getUsers() {
        return new ResponseEntity<>(userService.getUsers(), HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "/{username}", method = RequestMethod.GET)
    public ResponseEntity<User> getUser(@PathVariable(value = "username") String username) {
        return new ResponseEntity<>(userService.findUserByUsername(username), HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.PUT)
    public ResponseEntity<String> updateUser(@RequestBody User user) {
        userService.update(user);
        return new ResponseEntity<>("User updated", HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "/{username}/enable", method = RequestMethod.POST)
    public ResponseEntity<String> enableUser(@PathVariable(value = "username") String username) {
        userService.enable(username);
        return new ResponseEntity<>("User enabled", HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "/{username}/disable", method = RequestMethod.POST)
    public ResponseEntity<String> disableUser(@PathVariable(value = "username") String username) {
        userService.disable(username);
        return new ResponseEntity<>("User disabled", HttpStatus.OK);
    }

}

