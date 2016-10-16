package pl.edu.agh.sogo.domain;

import org.springframework.data.annotation.Id;

public class Truck {
    @Id
    private String id;

    private int capacity;

    private int load;

    private String registration;

//    @DBRef
//    private User user;

    private Location location;

    private String address;

    public Truck(){}

    public Truck(String registration, int capacity) {
        this.registration = registration;
        this.capacity = capacity;
        this.load = 0;
    }

    public String getId() {
        return id;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getLoad() {
        return load;
    }

    public void setLoad(int load) {
        this.load = load;
    }

//    public User getUser() {
//        return user;
//    }

//    public void setUser(User user) {
//        this.user = user;
//    }

    public String getRegistration() {
        return registration;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public String toString(){
        return "{id = " + id +
            ", registration = " + registration +
            ", capacity = " + capacity +
            ", load = " + load +
            ", address = "+ address +
            "}";
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
