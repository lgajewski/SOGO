package pl.edu.agh.sogo.security;

/**
 * Constants for Spring Security authorities.
 */
public final class SecurityConstants {

    // regex for acceptable logins
    public static final String LOGIN_REGEX = "^[_'.@A-Za-z0-9-]*$";

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String SYSTEM_MANAGER = "ROLE_SYSTEM_MANAGER";

    public static final String USER = "ROLE_USER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    public static final int PASSWORD_MIN_LENGTH = 4;
    public static final int PASSWORD_MAX_LENGTH = 100;

    private SecurityConstants() {
    }
}
