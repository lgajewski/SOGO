package pl.edu.agh.sogo.application.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.service.ITruckService;

import java.util.Collection;

@RestController
@RequestMapping("/trucks")
public class TruckController {
    @Autowired
    private ITruckService truckService;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Collection<Truck>> getTrucks() {
        return new ResponseEntity<>(truckService.getTrucks(), HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "/{registration}", method = RequestMethod.GET)
    public ResponseEntity<Truck> getTruck(@PathVariable(value = "registration") String registration) {
        return new ResponseEntity<>(truckService.findTruckByRegistration(registration), HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<String> addTruck(@RequestBody Truck truck) {
        truckService.add(truck);
        return new ResponseEntity<>("Truck added", HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "/", method = RequestMethod.PUT)
    public ResponseEntity<String> updateTruck(@RequestBody Truck truck) {
        truckService.update(truck);
        return new ResponseEntity<>("Truck updated", HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "/{registration}", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteTruck(@PathVariable(value = "registration") String registration) {
        truckService.delete(registration);
        return new ResponseEntity<>("Truck deleted", HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "/{registration}", method = RequestMethod.PATCH)
    public ResponseEntity<String> updateLocation(@PathVariable(value = "registration") String registration, @RequestBody Location location) {
        truckService.updateLocation(registration, location);
        return new ResponseEntity<>("Truck location updated", HttpStatus.OK);
    }
}

