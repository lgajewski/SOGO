package pl.edu.agh.sogo.service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ObjectAlreadyExistsException extends RuntimeException {

    public ObjectAlreadyExistsException(String type, String identifier) {
        super(type + " already exists: " + identifier);
    }
}
