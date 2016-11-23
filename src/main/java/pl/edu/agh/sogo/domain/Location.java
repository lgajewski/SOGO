package pl.edu.agh.sogo.domain;

public class Location {

    private double latitude;

    private double longitude;

    private String address;

    public Location() {}

    public Location(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "Location{" +
            "latitude=" + latitude +
            ", longitude=" + longitude +
            ", address='" + address + '\'' +
            '}';
    }
}
