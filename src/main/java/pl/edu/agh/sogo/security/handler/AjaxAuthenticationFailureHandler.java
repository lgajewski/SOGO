package pl.edu.agh.sogo.security.handler;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import pl.edu.agh.sogo.security.UserDetailsService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Returns a 401 error code (Unauthorized) to the client, when Ajax authentication fails.
 * When user is not activated, returns a 403 error code (FORBIDDEN).
 */
@Component
public class AjaxAuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {

        int httpErrorCode;
        String alertCode;
        String alertMessage = exception.getMessage();

        if (exception.getCause() instanceof UserDetailsService.UserNotActivatedException) {
            httpErrorCode = HttpServletResponse.SC_FORBIDDEN;
            alertCode = "error.accountdisabled";
        } else {
            httpErrorCode = HttpServletResponse.SC_UNAUTHORIZED;
            alertCode = "error.invalidcredentials";
        }

        response.addHeader("x-sogo-alert", alertCode);
        response.addHeader("x-sogo-message", alertMessage);

        response.sendError(httpErrorCode, "Authentication failed");
    }
}
