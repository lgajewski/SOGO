package pl.edu.agh.sogo.application.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Collection<Container>> getTrucks() {
        return new ResponseEntity<>(containerService.getContainers(), HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<Container> getContainer(@PathVariable(value = "id") String id) {
        return new ResponseEntity<>(containerService.getContainer(id), HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<String> addContainer(@RequestBody Container container) {
        containerService.add(container);
        return new ResponseEntity<>("Conatiner added", HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "/", method = RequestMethod.PUT)
    public ResponseEntity<String> updateContainer(@RequestBody Container container) {
        containerService.update(container);
        return new ResponseEntity<>("Container updated", HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteContainer(@PathVariable(value = "id") String id) {
        containerService.delete(id);
        return new ResponseEntity<>("Container deleted", HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "/{id}", method = RequestMethod.PATCH)
    public ResponseEntity<String> addSensor(@PathVariable(value = "id") String id, @RequestBody Sensor sensor, @RequestBody String sensorName) {
        containerService.addSensor(id, sensorName, sensor);
        return new ResponseEntity<>("Sensor added to container", HttpStatus.OK);
    }
}