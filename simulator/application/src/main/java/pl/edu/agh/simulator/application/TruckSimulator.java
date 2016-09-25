package pl.edu.agh.simulator.application;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import pl.edu.agh.simulator.domain.Location;
import pl.edu.agh.simulator.domain.Truck;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class TruckSimulator implements Runnable {

    private String serverAddress;
    private String csrf;
    private String jsessionid;
    private Boolean isRunning;

    public TruckSimulator(String serverAddress, String csrf, String jsessionid){
        this.serverAddress = serverAddress;
        this.isRunning = false;
        this.csrf= csrf;
        this.jsessionid= jsessionid;
    }
    public void createTrucks(List<Truck> trucks){
        try {
            Gson gson = new Gson();
            HttpClient client = HttpClientBuilder.create().build();

            HttpPost request = new HttpPost(serverAddress+"api/trucks");
            request.setHeader("Content-type", "application/json");
            request.setHeader("Cookie", jsessionid);
            request.setHeader("X-CSRF-TOKEN", csrf);

            for (Truck truck : trucks) {
                StringEntity params = new StringEntity(gson.toJson(truck));
                System.out.println(gson.toJson(truck));
                request.setEntity(params);
                HttpResponse response = client.execute(request);

                BufferedReader rd = new BufferedReader (new InputStreamReader(response.getEntity().getContent()));

                String line = "";
                while((line = rd.readLine()) != null) {
                    System.out.println(line);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void run() {
        try {
            Gson gson = new Gson();
            HttpClient client = HttpClientBuilder.create().build();

            HttpGet request = new HttpGet(serverAddress+"api/trucks");

            request.setHeader("Content-type", "application/json");
            request.setHeader("Cookie", jsessionid);
            request.setHeader("X-CSRF-TOKEN", csrf);
            while(true) {
                if(isRunning) {
                    HttpResponse response = client.execute(request);

                    BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

                    String line = "";
                    List<Truck> trucks = new ArrayList<>();
                    while ((line = rd.readLine()) != null) {
                        System.out.println(line);
                        JsonParser parser = new JsonParser();
                        JsonElement tradeElement = parser.parse(line);
                        JsonArray trucksArray = tradeElement.getAsJsonArray();
                        System.out.println(trucksArray);
                        for (JsonElement jsonElement : trucksArray) {
                            Truck truck = gson.fromJson(jsonElement, Truck.class);
                            trucks.add(truck);
                        }
                    }
                    Random rand = new Random();
                    for (Truck truck : trucks) {

                        HttpPatch updateLocationRequest = new HttpPatch(serverAddress + "api/trucks/" + truck.getRegistration().replace(" ", "%20"));
                        Location location = new Location(truck.getLocation().getLatitude() + (Math.pow(-1, rand.nextInt()) * 0.002976),
                                truck.getLocation().getLongitude() + (Math.pow(-1, rand.nextInt()) * 0.002976));


                        StringEntity params = new StringEntity(gson.toJson(location));
                        System.out.println(gson.toJson(location));
                        updateLocationRequest.setHeader("Content-type", "application/json");
                        updateLocationRequest.setHeader("Cookie", jsessionid);
                        updateLocationRequest.setHeader("X-CSRF-TOKEN", csrf);
                        updateLocationRequest.setEntity(params);
                        HttpResponse updateLocationResponse = client.execute(updateLocationRequest);

                        rd = new BufferedReader(new InputStreamReader(updateLocationResponse.getEntity().getContent()));

                        while ((line = rd.readLine()) != null) {
                            System.out.println(line);
                        }
                    }
                }
                Thread.sleep(2000);
            }

        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public boolean isRunning() {
        return isRunning;
    }

    public void setRunning(boolean running) {
        isRunning = running;
    }
}
