package pl.edu.agh.simulator.application;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import pl.edu.agh.simulator.domain.Container;
import pl.edu.agh.simulator.domain.Sensor;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class ContainerSimulator implements Runnable {

    private String serverAddress;
    private String csrf;
    private String jsessionid;
    private Boolean isRunning;

    public ContainerSimulator(String serverAddress, String csrf, String jsessionid){
        this.serverAddress = serverAddress;
        this.isRunning = false;
        this.csrf = csrf;
        this.jsessionid = jsessionid;
    }

    public void createContainers(List<Container> containers){
        try {
            Gson gson = new Gson();
            HttpClient client = HttpClientBuilder.create().build();

            HttpPost request = new HttpPost(serverAddress+"api/containers");
            request.setHeader("Content-type", "application/json");
            request.setHeader("Cookie", jsessionid);
            request.setHeader("X-CSRF-TOKEN", csrf);

             for (Container container : containers) {
                StringEntity params = new StringEntity(gson.toJson(container));
                System.out.println(gson.toJson(container));
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
            HttpGet request = new HttpGet(serverAddress+"api/containers");
            request.setHeader("Content-type", "application/json");
            request.setHeader("Cookie", jsessionid);
            request.setHeader("X-CSRF-TOKEN", csrf);
            while(true) {
                if(isRunning) {
                    HttpResponse response = client.execute(request);
                    BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
                    String line = "";
                    List<Container> containers = new ArrayList<>();
                    while ((line = rd.readLine()) != null) {
                        System.out.println(line);
                        JsonParser parser = new JsonParser();
                        JsonElement tradeElement = parser.parse(line);
                        JsonArray containersArray = tradeElement.getAsJsonArray();
                        System.out.println(containersArray);
                        for (JsonElement jsonElement : containersArray) {
                            Container container = gson.fromJson(jsonElement, Container.class);
                            containers.add(container);
                        }
                    }
                    Random rand = new Random();
                    for (Container container : containers) {
                        HttpPut updateLocationRequest = new HttpPut(serverAddress + "api/containers");
                        for (String sensorType : container.getSensors().keySet()) {
                            Sensor sensor = container.getSensors().get(sensorType);
                            if (sensorType.equalsIgnoreCase("device")) {
                                System.out.println(sensorType);
                                if ((double) sensor.getValue() <= 99) {
                                    sensor.setValue((int) ((double) sensor.getValue() + 1));
                                }
                            } else {
                                double rn = rand.nextDouble();
                                if ((double) sensor.getValue() + rn < 100.0) {
                                    sensor.setValue((double) sensor.getValue() + rn);
                                }
                            }
                        }
                        StringEntity params = new StringEntity(gson.toJson(container));
                        System.out.println(gson.toJson(container));
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
