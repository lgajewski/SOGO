package pl.edu.agh.sogo.service.directions;

import com.google.maps.DirectionsApi;
import com.google.maps.DirectionsApiRequest;
import com.google.maps.GeoApiContext;
import com.google.maps.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pl.edu.agh.sogo.domain.Location;
import pl.edu.agh.sogo.service.geocoder.GoogleMapsReverseGeocoder;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class DirectionsService {

    private static final Logger log = LoggerFactory.getLogger(GoogleMapsReverseGeocoder.class);

    private final GeoApiContext context;

    public DirectionsService() {
        this.context = new GeoApiContext().setApiKey("AIzaSyB5nmqhScXjuLEpFhwwszBVsKmb2OWSoQ4");
    }

    public List<Location> getPath(List<Location> locations){
        DirectionsApiRequest request = DirectionsApi.newRequest(context);
        Location origin = locations.remove(0);
        Location destination = locations.remove(locations.size()-1);
        LatLng[] waypoints = new LatLng[locations.size()];
        List<Location> path = new LinkedList<>();
        int i=0;
        for(Location loc : locations){
            waypoints[i] = new LatLng(loc.getLatitude(), loc.getLongitude());
            i++;
        }
        request.origin(new LatLng(origin.getLatitude(), origin.getLongitude()))
            .destination(new LatLng(destination.getLatitude(), destination.getLongitude()))
            .optimizeWaypoints(false)
            .waypoints(waypoints)
            .mode(TravelMode.DRIVING);

        try {
            DirectionsResult result = request.await();
            DirectionsRoute[] route = result.routes;
            for(DirectionsRoute r : route){
                for(DirectionsLeg leg : r.legs){
                    for(DirectionsStep step : leg.steps){
                        List<LatLng> latLngList = step.polyline.decodePath();
                        path.addAll(IntStream.range(0, latLngList.size()).filter(n -> n % 10 == 0).mapToObj(latLngList::get).map(latLng -> new Location(latLng.lat, latLng.lng)).collect(Collectors.toList()));
//                        log.info(path.toString());
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return path;
    }


}
