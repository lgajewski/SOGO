/*
 * Copyright © 2016 and Confidential to Pegasystems Inc. All rights reserved.
 */

package pl.edu.agh.sogo.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Sensor;
import pl.edu.agh.sogo.security.SecurityConstants;
import pl.edu.agh.sogo.service.ContainerService;
import pl.edu.agh.sogo.service.RouteService;

import java.security.Principal;
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/containers")
public class ContainerController {

    private static final Logger log = LoggerFactory.getLogger(RouteService.class);

    @Autowired
    private ContainerService containerService;

//    @Autowired
//    private SseService sseService;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET)
    public Collection<Container> getContainers() {
        log.info("[GET][/api/containers] getContainers()");
        return containerService.getContainers();
    }

    @ResponseBody
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Container getContainer(@PathVariable(value = "id") String id) {
        log.info("[GET][/api/containers/" + id + "] getContainer(" + id + ")");
        return containerService.getContainer(id);
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    @Secured(SecurityConstants.SYSTEM_MANAGER)
    public void addContainer(@RequestBody Container container) {
        log.info("[POST][/api/containers] addContainer()");
        containerService.add(container);
        return;
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.PUT)
    @Secured(SecurityConstants.SYSTEM_MANAGER)
    public void updateContainer(@RequestBody Container container) {
        log.info("[PUT][/api/containers] updateContainer(" + container + ")");
        containerService.update(container);


    }

    @ResponseBody
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @Secured(SecurityConstants.SYSTEM_MANAGER)
    public void deleteContainer(@PathVariable(value = "id") String id) {
        log.info("[DELETE][/api/containers/" + id + "] deleteContainer(" + id + ")");
        containerService.delete(id);
        return;
    }

    @ResponseBody
    @RequestMapping(value = "/{id}", method = RequestMethod.PATCH)
    @Secured(SecurityConstants.ADMIN)
    public void addSensor(@PathVariable(value = "id") String id, @RequestBody Sensor sensor, @RequestBody String sensorName) {
        containerService.addSensor(id, sensorName, sensor);
        log.info("[PATCH][/api/containers/" + id + "] addSensor(" + id + ", " + sensorName + ")");
        return;
    }

    @ResponseBody
    @RequestMapping(value = "/{id}/repair", method = RequestMethod.POST)
    @Secured(SecurityConstants.USER)
    public void repairContainer(@PathVariable(value = "id") String id, Principal principal) {
        containerService.repairContainer(id, principal.getName());
        log.info("[POST][/api/containers/" + id + "/repair] repairContainer(" + id + ", " + principal.getName()+ ")");
        return;
    }

    @ResponseBody
    @RequestMapping(value = "/toRepair", method = RequestMethod.GET)
    @Secured(SecurityConstants.USER)
    public List<Container> getContainersToRepair(Principal principal) {
        List<Container> containers = containerService.getContainersToRepair(principal.getName());
        log.info("[GET][/api/containers/toRepair] getContainersToRepair(" + principal.getName()+ ")");
        return containers;
    }
}
