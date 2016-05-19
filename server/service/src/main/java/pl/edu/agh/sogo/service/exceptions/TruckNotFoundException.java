package pl.edu.agh.sogo.service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class TruckNotFoundException extends RuntimeException {

    public TruckNotFoundException(String registration) {
        super("truck not found, registration:  " + registration);
    }
}
