package pl.edu.agh.sogo.web.dto;

import pl.edu.agh.sogo.domain.User;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

import static pl.edu.agh.sogo.security.SecurityConstants.PASSWORD_MAX_LENGTH;
import static pl.edu.agh.sogo.security.SecurityConstants.PASSWORD_MIN_LENGTH;

/**
 * View Model extending the UserDTO, which is meant to be used in the user management UI.
 */
public class ManagedUserDTO extends UserDTO {

    private String id;

    @NotNull
    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH)
    private String password;

    public ManagedUserDTO(User user) {
        super(user);
        this.id = user.getId();
        this.password = null;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String toString() {
        return "ManagedUserDTO{" +
            "id=" + id +
            "} " + super.toString();
    }
}
