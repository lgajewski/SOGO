/*
 * Copyright © 2016 and Confidential to Pegasystems Inc. All rights reserved.
 */

package pl.edu.agh.sogo.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.domain.Truck;
import pl.edu.agh.sogo.service.RouteService;
import pl.edu.agh.sogo.service.SseService;
import pl.edu.agh.sogo.service.TruckService;

import java.util.ArrayList;
import java.util.Collection;

@RestController
@RequestMapping("/api/trucks")
public class TruckController {

    private static final Logger log = LoggerFactory.getLogger(RouteService.class);

    @Autowired
    private TruckService truckService;

    @Autowired
    private SseService sseService;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET)
    public Collection<Truck> getTrucks() {
        try {
            log.info("[GET][/api/trucks] getTrucks()");
            return truckService.getTrucks();
        } catch (Exception e) {
            e.printStackTrace();
            log.error("updateLocation", e);
            return new ArrayList<>();
        }
    }

    @ResponseBody
    @RequestMapping(value = "/{registration}", method = RequestMethod.GET)
    public Truck getTruck(@PathVariable(value = "registration") String registration) {
        log.info("[GET][/api/trucks/" + registration + "] getTruck(" + registration + ")");
        return truckService.findTruckByRegistration(registration);
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    public void addTruck(@RequestBody Truck truck) {
        log.info("[POST][/api/trucks/] addTruck()");
        truckService.add(truck);
    }

    @ResponseBody
    @RequestMapping(value = "/", method = RequestMethod.PUT)
    public void updateTruck(@RequestBody Truck truck) {
        log.info("[PUT][/api/trucks/] updateTruck()");
        truckService.update(truck);
    }

    @ResponseBody
    @RequestMapping(value = "/{registration}", method = RequestMethod.DELETE)
    public void deleteTruck(@PathVariable(value = "registration") String registration) {
        log.info("[DELETE][/api/trucks/" + registration + "] deleteTruck(" + registration + ")");
        truckService.delete(registration);
    }

    @ResponseBody
    @RequestMapping(value = "/{registration}", method = RequestMethod.PATCH)
    public void updateLocation(@PathVariable(value = "registration") String registration, @RequestBody Location location) {
        log.info("[PATCH][/api/trucks/" + registration + "] updateLocation(" + registration + ")");

        truckService.updateLocation(registration, location);

        // emit updated truck to browsers that subscribe on SSE
        sseService.emit(truckService.findTruckByRegistration(registration));
    }
}

