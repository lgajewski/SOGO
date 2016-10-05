/*
 * Copyright © 2016 and Confidential to Pegasystems Inc. All rights reserved.
 */

package pl.edu.agh.sogo.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Sensor;
import pl.edu.agh.sogo.service.ContainerService;
import pl.edu.agh.sogo.service.RouteService;
import pl.edu.agh.sogo.service.SseService;

import java.util.Collection;

@RestController
@RequestMapping("/api/containers")
public class ContainerController {

    private static final Logger log = LoggerFactory.getLogger(RouteService.class);

    @Autowired
    private ContainerService containerService;

    @Autowired
    private SseService sseService;

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
    public void addContainer(@RequestBody Container container) {
        log.info("[POST][/api/containers] addContainer()");
        containerService.add(container);
        return;
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.PUT)
    public void updateContainer(@RequestBody Container container) {
        log.info("[PUT][/api/containers] updateContainer(" + container + ")");
        containerService.update(container);

        // emit updated container to browsers that subscribe on SSE
        sseService.emit("container", container);
    }

    @ResponseBody
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void deleteContainer(@PathVariable(value = "id") String id) {
        log.info("[DELETE][/api/containers/" + id + "] deleteContainer(" + id + ")");
        containerService.delete(id);
        return;
    }

    @ResponseBody
    @RequestMapping(value = "/{id}", method = RequestMethod.PATCH)
    public void addSensor(@PathVariable(value = "id") String id, @RequestBody Sensor sensor, @RequestBody String sensorName) {
        containerService.addSensor(id, sensorName, sensor);
        log.info("[PATCH][/api/containers/" + id + "] addSensor(" + id + ", " + sensorName + ")");
        return;
    }
}
