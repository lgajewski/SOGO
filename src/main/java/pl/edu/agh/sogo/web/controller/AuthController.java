package pl.edu.agh.sogo.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.sogo.persistence.UserRepository;
import pl.edu.agh.sogo.service.UserService;
import pl.edu.agh.sogo.web.dto.UserDTO;

import javax.inject.Inject;
import java.security.Principal;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class AuthController {

    private final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Inject
    private UserRepository userRepository;

    @Inject
    private UserService userService;

    /**
     * GET  /authenticate : check if the user is authenticated, and return its login.
     *
     * @param principal principal represents authenticated user
     * @return the login if the user is authenticated
     */
    @RequestMapping(value = "/authenticate",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public Principal isAuthenticated(Principal principal) {
        log.info("[GET][/api/authenticate] isAuthenticated(principal)");
        return principal;
    }

    /**
     * GET  /user : get the current user.
     *
     * @return the ResponseEntity with status 200 (OK) and the current user in body, or status 500 (Internal Server Error) if the user couldn't be returned
     */
    @RequestMapping(value = "/user",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDTO> getUser() {
        log.info("[GET][/api/user] getUSer()");
        return new ResponseEntity<>(new UserDTO(), HttpStatus.OK);
//        return Optional.ofNullable(userService.getUserWithAuthorities())
//            .map(user -> new ResponseEntity<>(new UserDTO(user), HttpStatus.OK))
//            .orElse(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
    }

}
