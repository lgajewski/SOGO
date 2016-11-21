package pl.edu.agh.sogo.config;

import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serializable;

/**
 * Controller advice to translate the server side exceptions to client-friendly json structures.
 */
@ControllerAdvice
public class ExceptionTranslator {

    private static final String ERR_CONCURRENCY_FAILURE = "error.concurrencyFailure";
    private static final String ERR_ACCESS_DENIED = "error.accessDenied";
    private static final String ERR_VALIDATION = "error.validation";
    private static final String ERR_METHOD_NOT_SUPPORTED = "error.methodNotSupported";
    private static final String ERR_INTERNAL_SERVER_ERROR = "error.internalServerError";

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorDTO> processAccessDeniedException(AccessDeniedException ex) {
        return buildResponse(HttpStatus.FORBIDDEN, ERR_ACCESS_DENIED, ex.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorDTO> processRuntimeException(Exception ex) {
        ResponseStatus responseStatus = AnnotationUtils.findAnnotation(ex.getClass(), ResponseStatus.class);
        return responseStatus != null ?
            buildResponse(responseStatus.value(), "error." + responseStatus.value().value(), responseStatus.reason()) :
            buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ERR_INTERNAL_SERVER_ERROR, "Internal server error");
    }

    private ResponseEntity<ErrorDTO> buildResponse(HttpStatus httpStatus, String message, String description) {
        return ResponseEntity.status(httpStatus).body(new ErrorDTO(message, description));
    }

    /**
     * DTO for transferring  error message
     */
    private static class ErrorDTO implements Serializable {

        private static final long serialVersionUID = 1L;

        private final String message;
        private final String description;

        ErrorDTO(String message, String description) {
            this.message = message;
            this.description = description;
        }

        public String getMessage() {
            return message;
        }

        public String getDescription() {
            return description;
        }
    }
}
