package pl.edu.agh.sogo.domain;

public class Sensor <T> {

    private T value;

    private int errorCode;

    public T getValue() {
        return value;
    }

    public void setValue(T value) {
        this.value = value;
    }

    public int getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }

    public String toString(){
        return "{value = " + value +
            ", errorCode = " + errorCode + "}";
    }
}
