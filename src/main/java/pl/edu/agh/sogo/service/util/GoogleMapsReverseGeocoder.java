package pl.edu.agh.sogo.service.util;

import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.LatLng;
import org.springframework.stereotype.Service;

@Service
public class GoogleMapsReverseGeocoder {
    GeoApiContext context;
    public GoogleMapsReverseGeocoder(){
        context = new GeoApiContext().setApiKey("AIzaSyB5nmqhScXjuLEpFhwwszBVsKmb2OWSoQ4");
    }

    public String reverseGeocode(double lat, double lng) throws Exception {
        GeocodingResult[] results = GeocodingApi.reverseGeocode(context, new LatLng(lat, lng)).await();
        return results[0].formattedAddress;
    }

}
