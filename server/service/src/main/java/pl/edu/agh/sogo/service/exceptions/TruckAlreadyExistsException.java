package pl.edu.agh.sogo.service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class TruckAlreadyExistsException extends RuntimeException {

    public TruckAlreadyExistsException(String registration) {
        super("truck already exists, registration: " + registration);
    }

}
