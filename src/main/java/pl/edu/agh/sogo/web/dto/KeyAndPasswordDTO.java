package pl.edu.agh.sogo.web.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Size;

import static pl.edu.agh.sogo.security.SecurityConstants.PASSWORD_MAX_LENGTH;
import static pl.edu.agh.sogo.security.SecurityConstants.PASSWORD_MIN_LENGTH;

/**
 * View Model object for storing the user's key and password.
 */
public class KeyAndPasswordDTO {

    private String key;

    @NotNull
    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH)
    private String newPassword;

    public KeyAndPasswordDTO() {
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
