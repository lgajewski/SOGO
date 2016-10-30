package pl.edu.agh.sogo.web.controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.domain.User;
import pl.edu.agh.sogo.persistence.UserRepository;
import pl.edu.agh.sogo.security.SecurityConstants;
import pl.edu.agh.sogo.service.MailService;
import pl.edu.agh.sogo.service.UserService;
import pl.edu.agh.sogo.web.dto.ManagedUserDTO;
import pl.edu.agh.sogo.web.util.HeaderUtil;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller for managing users.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final Logger log = LoggerFactory.getLogger(UserController.class);

    @Inject
    private UserRepository userRepository;

    @Inject
    private UserService userService;

    @Inject
    private MailService mailService;

    /**
     * POST  /users  : Creates a new user.
     * <p>
     * Creates a new user if the login and email are not already used, and sends an
     * mail with an activation link.
     * The user needs to be activated on creation.
     * </p>
     *
     * @param managedUserDTO the user to create
     * @param request        the HTTP request
     * @return the ResponseEntity with status 201 (Created) and with body the new user, or with status 400 (Bad Request) if the login or email is already in use
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured(SecurityConstants.ADMIN)
    public ResponseEntity<?> createUser(@Valid @RequestBody ManagedUserDTO managedUserDTO, HttpServletRequest request) throws URISyntaxException {
        log.debug("REST request to save User : {}", managedUserDTO);

        //Lowercase the user login before comparing with database
        if (userRepository.findOneByLogin(managedUserDTO.getLogin().toLowerCase()).isPresent()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createAlert("userexists", "Login already in use"))
                .body(null);
        } else if (userRepository.findOneByEmail(managedUserDTO.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createAlert("emailexists", "Email already in use"))
                .body(null);
        } else {
            User newUser = userService.createUser(managedUserDTO);
            String baseUrl = request.getScheme() + // "http"
                "://" +                                // "://"
                request.getServerName() +              // "myhost"
                ":" +                                  // ":"
                request.getServerPort() +              // "80"
                request.getContextPath();              // "/myContextPath" or "" if deployed in root context
            mailService.sendCreationEmail(newUser, baseUrl);
            return ResponseEntity.created(new URI("/api/users/" + newUser.getLogin()))
                .headers(HeaderUtil.createAlert("A user is created with identifier " + newUser.getLogin(), newUser.getLogin()))
                .body(newUser);
        }
    }

    /**
     * PUT  /users : Updates an existing User.
     *
     * @param managedUserDTO the user to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated user,
     * or with status 400 (Bad Request) if the login or email is already in use,
     * or with status 500 (Internal Server Error) if the user couldn't be updated
     */
    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured(SecurityConstants.ADMIN)
    public ResponseEntity<ManagedUserDTO> updateUser(@Valid @RequestBody ManagedUserDTO managedUserDTO) {
        log.debug("REST request to update User : {}", managedUserDTO);
        Optional<User> existingUser = userRepository.findOneByEmail(managedUserDTO.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(managedUserDTO.getId()))) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createAlert("emailexists", "E-mail already in use")).body(null);
        }
        existingUser = userRepository.findOneByLogin(managedUserDTO.getLogin().toLowerCase());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(managedUserDTO.getId()))) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createAlert("userexists", "Login already in use")).body(null);
        }
        userService.updateUser(managedUserDTO.getLogin(), managedUserDTO.getFirstName(),
            managedUserDTO.getLastName(), managedUserDTO.getEmail(), managedUserDTO.isActivated(),
            managedUserDTO.getLangKey(), managedUserDTO.getAuthorities());

        return ResponseEntity.ok()
            .headers(HeaderUtil.createAlert("A user is updated with identifier " + managedUserDTO.getLogin(), managedUserDTO.getLogin()))
            .body(new ManagedUserDTO(userService.getUserById(managedUserDTO.getId())));
    }

    /**
     * GET  /users : get all users.
     *
     * @return the ResponseEntity with status 200 (OK) and with body all users
     */
    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured(SecurityConstants.ADMIN)
    public ResponseEntity<List<ManagedUserDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<ManagedUserDTO> managedUserDTOs = users.stream()
            .map(ManagedUserDTO::new)
            .collect(Collectors.toList());
        return new ResponseEntity<>(managedUserDTOs, HttpStatus.OK);
    }

    /**
     * GET  /users/:login : get the "login" user.
     *
     * @param login the login of the user to find
     * @return the ResponseEntity with status 200 (OK) and with body the "login" user, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/{login:" + SecurityConstants.LOGIN_REGEX + "}", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured(SecurityConstants.ADMIN)
    public ResponseEntity<ManagedUserDTO> getUser(@PathVariable String login) {
        log.debug("REST request to get User : {}", login);
        return userService.getUserByLogin(login)
            .map(ManagedUserDTO::new)
            .map(managedUserDTO -> new ResponseEntity<>(managedUserDTO, HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE /users/:login : delete the "login" User.
     *
     * @param login the login of the user to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/{login:" + SecurityConstants.LOGIN_REGEX + "}", method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured(SecurityConstants.ADMIN)
    public ResponseEntity<Void> deleteUser(@PathVariable String login) {
        log.debug("REST request to delete User: {}", login);
        userService.deleteUser(login);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert("A user is deleted with identifier " + login, login)).build();
    }

    /**
     * PUT  /users/self : Updates currently logged User.
     *
     * @param managedUserDTO the user to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated user,
     * or with status 400 (Bad Request) if the login or email is already in use,
     * or with status 500 (Internal Server Error) if the user couldn't be updated
     */
    @RequestMapping(value = "/self", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ManagedUserDTO> updateUser(Principal principal, @RequestBody ManagedUserDTO managedUserDTO) {
        if (principal.getName().equals(managedUserDTO.getLogin())) {
            return updateUser(managedUserDTO);
        }

        return ResponseEntity.badRequest().headers(HeaderUtil.createAlert("diferentuserupdate", "Trying to update different user")).body(null);
    }

    @RequestMapping("/user")
    public Principal user(Principal user) {
        return user;
    }
}
