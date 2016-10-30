package pl.edu.agh.sogo.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.domain.User;
import pl.edu.agh.sogo.persistence.UserRepository;
import pl.edu.agh.sogo.service.MailService;
import pl.edu.agh.sogo.service.UserService;
import pl.edu.agh.sogo.web.dto.KeyAndPasswordDTO;
import pl.edu.agh.sogo.web.dto.ManagedUserDTO;
import pl.edu.agh.sogo.web.dto.UserDTO;
import pl.edu.agh.sogo.web.util.HeaderUtil;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.security.Principal;
import java.util.Optional;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api/account")
public class AccountController {

    public static final String ERROR_USER_EXISTS = "error.userexists";
    public static final String ERROR_EMAIL_EXISTS = "error.emailexists";

    private final Logger log = LoggerFactory.getLogger(AccountController.class);

    @Inject
    private UserRepository userRepository;

    @Inject
    private UserService userService;

    @Inject
    private MailService mailService;

    /**
     * POST  /register : register the user.
     *
     * @param managedUserDTO the managed user View Model
     * @param request        the HTTP request
     * @return the ResponseEntity with status 201 (Created) if the user is registered or 400 (Bad Request) if the login or e-mail is already in use
     */
    @RequestMapping(value = "/register",
        method = RequestMethod.POST,
        produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE})
    public ResponseEntity<?> registerAccount(@Valid @RequestBody ManagedUserDTO managedUserDTO, HttpServletRequest request) {
        log.debug("REST request to save User : {}", managedUserDTO);

        return userRepository.findOneByLogin(managedUserDTO.getLogin().toLowerCase())
            .map(user -> ResponseEntity.badRequest().headers(HeaderUtil.createAlert(ERROR_USER_EXISTS, "Login already in use")).body(null))
            .orElseGet(() -> userRepository.findOneByEmail(managedUserDTO.getEmail())
                .map(user -> ResponseEntity.badRequest().headers(HeaderUtil.createAlert(ERROR_EMAIL_EXISTS, "Email already in use")).body(null))
                .orElseGet(() -> {
                    User user = userService.createUser(managedUserDTO);
                    String baseUrl = request.getScheme() + // "http"
                        "://" +                                // "://"
                        request.getServerName() +              // "myhost"
                        ":" +                                  // ":"
                        request.getServerPort() +              // "80"
                        request.getContextPath();              // "/myContextPath" or "" if deployed in root context

                    mailService.sendActivationEmail(user, baseUrl);
                    return new ResponseEntity<>(user, HttpStatus.CREATED);
                })
            );
    }

    /**
     * GET  /account : get the current user.
     *
     * @return the ResponseEntity with status 200 (OK) and the current user in body, or status 500 (Internal Server Error) if the user couldn't be returned
     */
    @RequestMapping(method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDTO> getAccount(Principal principal) {
        return userService.getUserByLogin(principal.getName())
            .map(user -> new ResponseEntity<>(new UserDTO(user), HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    /**
     * POST  /account : update the current user information.
     *
     * @param userDTO the current user information
     * @return the ResponseEntity with status 200 (OK), or status 400 (Bad Request) or 500 (Internal Server Error) if the user couldn't be updated
     */
    @RequestMapping(method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveAccount(@Valid @RequestBody UserDTO userDTO, Principal principal) {
        Optional<User> existingUser = userRepository.findOneByEmail(userDTO.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getLogin().equalsIgnoreCase(userDTO.getLogin()))) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createAlert(ERROR_EMAIL_EXISTS, "Email already in use")).body(null);
        }
        return userRepository
            .findOneByLogin(principal.getName())
            .map(u -> {
                userService.updateUser(userDTO.getLogin(), userDTO.getFirstName(), userDTO.getLastName(), userDTO.getEmail(),
                    userDTO.isActivated(), userDTO.getLangKey(), userDTO.getAuthorities());
                return new ResponseEntity<String>(HttpStatus.OK);
            })
            .orElseGet(() -> new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    /**
     * POST  /account/change_password : changes the current user's password
     *
     * @param keyAndPassword the new password
     * @return the ResponseEntity with status 200 (OK), or status 400 (Bad Request) if the new password is not strong enough
     */
    @RequestMapping(value = "/change_password",
        method = RequestMethod.POST,
        produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<?> changePassword(Principal principal, @Valid @RequestBody KeyAndPasswordDTO keyAndPassword) {
        userService.changePassword(principal.getName(), keyAndPassword.getNewPassword());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * POST   /account/reset_password/init : Send an e-mail to reset the password of the user
     *
     * @param mail    the mail of the user
     * @param request the HTTP request
     * @return the ResponseEntity with status 200 (OK) if the e-mail was sent, or status 400 (Bad Request) if the e-mail address is not registered
     */
    @RequestMapping(value = "/reset_password/init",
        method = RequestMethod.POST,
        produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<?> requestPasswordReset(@RequestBody String mail, HttpServletRequest request) {
        return userService.requestPasswordReset(mail)
            .map(user -> {
                String baseUrl = request.getScheme() +
                    "://" +
                    request.getServerName() +
                    ":" +
                    request.getServerPort() +
                    request.getContextPath();
                mailService.sendPasswordResetMail(user, baseUrl);
                return ResponseEntity.ok();
                // TODO alert key ?
            }).orElse(ResponseEntity.badRequest().headers(HeaderUtil.createAlert("email", "e-mail address not registered"))).body(null);
    }

    /**
     * POST   /account/reset_password/finish : Finish to reset the password of the user
     *
     * @param keyAndPassword the generated key and the new password
     * @return the ResponseEntity with status 200 (OK) if the password has been reset,
     * or status 400 (Bad Request) or 500 (Internal Server Error) if the password could not be reset
     */
    @RequestMapping(value = "/reset_password/finish",
        method = RequestMethod.POST,
        produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> finishPasswordReset(@Valid @RequestBody KeyAndPasswordDTO keyAndPassword) {
        return userService.completePasswordReset(keyAndPassword.getNewPassword(), keyAndPassword.getKey())
            .map(user -> new ResponseEntity<String>(HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
    }

}
