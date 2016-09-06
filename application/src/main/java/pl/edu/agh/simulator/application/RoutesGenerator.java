package pl.edu.agh.simulator.application;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClientBuilder;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class RoutesGenerator {

    private String serverAddress;
    private String csrf;
    private String jsessionid;
    private Boolean isRunning;


    public RoutesGenerator(String serverAddress, String csrf, String jsessionid){
        this.serverAddress = serverAddress;
        this.isRunning = false;
        this.csrf= csrf;
        this.jsessionid= jsessionid;
    }

    public void generate() {
        HttpClient client = HttpClientBuilder.create().build();
        HttpPost request = new HttpPost(serverAddress+"api/routes/generate");
        request.addHeader("Content-type", "application/json");
        request.setHeader("Cookie", jsessionid);
        request.setHeader("X-CSRF-TOKEN", csrf);
        HttpResponse response = null;
        try {
            response = client.execute(request);
            BufferedReader rd = new BufferedReader (new InputStreamReader(response.getEntity().getContent()));
            String line = "";
            while((line = rd.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
