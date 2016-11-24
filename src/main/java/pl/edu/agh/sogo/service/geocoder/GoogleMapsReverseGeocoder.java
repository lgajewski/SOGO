package pl.edu.agh.sogo.service.geocoder;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.LatLng;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class GoogleMapsReverseGeocoder {

    private static final Logger log = LoggerFactory.getLogger(GoogleMapsReverseGeocoder.class);

    private final GeoApiContext context;

    public GoogleMapsReverseGeocoder() {
        this.context = new GeoApiContext().setApiKey("AIzaSyB5nmqhScXjuLEpFhwwszBVsKmb2OWSoQ4");
    }

    public String reverseGeocode(double lat, double lng) {
        try {
            GeocodingResult[] results = GeocodingApi.reverseGeocode(context, new LatLng(lat, lng)).await();
            return results[0].formattedAddress;
        } catch (Exception e) {
            log.warn("Can't reverse geocode: " + e.getMessage());
            return null;
        }
    }

}
