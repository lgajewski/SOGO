package pl.edu.agh.sogo.security;

/**
 * Constants for Spring Security authorities.
 */
public final class SecurityConstants {

    // regex for acceptable logins
    public static final String LOGIN_REGEX = "^[_'.@A-Za-z0-9-]*$";

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_USER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    private SecurityConstants() {
    }
}
