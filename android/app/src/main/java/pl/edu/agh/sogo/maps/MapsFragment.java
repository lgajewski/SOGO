package pl.edu.agh.sogo.maps;


import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import pl.edu.agh.sogo.android.R;


/**
 * A simple {@link Fragment} subclass.
 */
public class MapsFragment extends MapFragment implements OnMapReadyCallback {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        getMapAsync(this);

        return super.onCreateView(inflater, container, savedInstanceState);
    }


    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap map) {
        // Add a marker in Sydney and move the camera
        LatLng cracow = new LatLng(50.0321004, 19.9320474);

        try {
            // TODO add permission check
            map.setMyLocationEnabled(true);
        } catch (SecurityException e) {
            e.printStackTrace();
        }

        map.addMarker(new MarkerOptions()
                .position(cracow)
                .title("Container 1")
                .icon(BitmapDescriptorFactory.fromResource(R.drawable.ic_map_trash_green))
                .snippet("Only paper"));

        map.addMarker(new MarkerOptions()
                .position(new LatLng(50.0421004, 19.8820474))
                .icon(BitmapDescriptorFactory.fromResource(R.drawable.ic_map_trash_blue))
                .title("Container 2")
                .snippet("Only plastic"));

        map.addMarker(new MarkerOptions()
                .position(new LatLng(50.0121004, 19.84320474))
                .icon(BitmapDescriptorFactory.fromResource(R.drawable.ic_map_trash_yellow))
                .title("Container 3")
                .snippet("All rubbish"));


        LatLng truck = new LatLng(50.0521004, 19.9500474);


        // Flat markers will rotate when the map is rotated,
        // and change perspective when the map is tilted.
        map.addMarker(new MarkerOptions()
                .icon(BitmapDescriptorFactory.fromResource(R.drawable.ic_map_truck))
                .anchor(0.0f, 1.0f) // Anchors the marker on the bottom left
                .title("truck")
                .position(truck)
                .flat(true));


        CameraPosition cameraPosition = CameraPosition.builder()
                .target(truck)
                .zoom(13)
//                .bearing(90)
                .build();

        // Animate the change in camera view over 2 seconds
        map.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition),
                2000, null);
    }
}
