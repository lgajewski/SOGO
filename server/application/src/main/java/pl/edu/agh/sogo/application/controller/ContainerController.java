package pl.edu.agh.sogo.application.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.sogo.domain.Container;
import pl.edu.agh.sogo.domain.Sensor;
import pl.edu.agh.sogo.service.IContainerService;

import java.util.Collection;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/containers")
public class ContainerController {
    @Autowired
    private IContainerService containerService;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET)
    public Collection<Container> getTrucks() {
        return containerService.getContainers();
    }

    @ResponseBody
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Container getContainer(@PathVariable(value = "id") String id) {
        return containerService.getContainer(id);
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    public void addContainer(@RequestBody Container container) {
        containerService.add(container);
        return;
    }

    @ResponseBody
    @RequestMapping(value = "/", method = RequestMethod.PUT)
    public void updateContainer(@RequestBody Container container) {
        containerService.update(container);
        return;
    }

    @ResponseBody
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void deleteContainer(@PathVariable(value = "id") String id) {
        containerService.delete(id);
        return;
    }

    @ResponseBody
    @RequestMapping(value = "/{id}", method = RequestMethod.PATCH)
    public void addSensor(@PathVariable(value = "id") String id, @RequestBody Sensor sensor, @RequestBody String sensorName) {
        containerService.addSensor(id, sensorName, sensor);
        return;
    }
}