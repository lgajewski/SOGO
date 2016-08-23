/*
 * Copyright © 2016 and Confidential to Pegasystems Inc. All rights reserved.
 */

package pl.edu.agh.sogo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.service.ITruckService;

import java.util.Collection;

@RestController
@RequestMapping("/api/trucks")
public class TruckController {
    @Autowired
    private ITruckService truckService;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET)
    public Collection<Truck> getTrucks() {
        return truckService.getTrucks();
    }

    @ResponseBody
    @RequestMapping(value = "/{registration}", method = RequestMethod.GET)
    public Truck getTruck(@PathVariable(value = "registration") String registration) {
        return truckService.findTruckByRegistration(registration);
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    public void addTruck(@RequestBody Truck truck) {
        truckService.add(truck);
        return;
    }

    @ResponseBody
    @RequestMapping(value = "/", method = RequestMethod.PUT)
    public void updateTruck(@RequestBody Truck truck) {
        truckService.update(truck);
        return;
    }

    @ResponseBody
    @RequestMapping(value = "/{registration}", method = RequestMethod.DELETE)
    public void deleteTruck(@PathVariable(value = "registration") String registration) {
        truckService.delete(registration);
        return;
    }

    @ResponseBody
    @RequestMapping(value = "/{registration}", method = RequestMethod.PATCH)
    public void updateLocation(@PathVariable(value = "registration") String registration, @RequestBody Location location) {
        truckService.updateLocation(registration, location);
        return;
    }
}

