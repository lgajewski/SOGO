package pl.edu.agh.simulator.application;

import javafx.application.Application;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClientBuilder;
import pl.edu.agh.simulator.domain.Container;
import pl.edu.agh.simulator.domain.Truck;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class SimulatorApp extends Application {
    private static final String DEFAULT_SERVER_ADDRESS = "http://localhost:8081/";

    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage stage) {
        ElementFactory elementFactory = new ElementFactory();
        ContainerAndTruckFactory containerAndTruckFactory = new ContainerAndTruckFactory();

        stage.setTitle("SOGO Simulator");
        GridPane grid = elementFactory.createGridPane();
        grid.setAlignment(Pos.CENTER);
        Text sceneTitle = new Text("Server address");
        sceneTitle.setFont(Font.font("Tahoma", FontWeight.NORMAL, 20));
        grid.add(sceneTitle, 0, 0, 2, 1);

        TextField userTextField = new TextField();
        userTextField.setText(DEFAULT_SERVER_ADDRESS);
        grid.add(userTextField, 0, 1);

        Button btn = new Button("Enter");
        btn.setOnAction(event -> {
            System.out.println(userTextField.getText());
            HttpClient loginClient = HttpClientBuilder.create().build();
            HttpGet sampleRequest = new HttpGet(userTextField.getText());
            HttpResponse sampleResponse = null;

            String csrfHeader = "";
            String jsessionidHeader = "";
            try {

                sampleResponse = loginClient.execute(sampleRequest);
                for(Header header : sampleResponse.getAllHeaders()){
                    if(header.getName().equalsIgnoreCase("set-cookie") && header.getValue().contains("CSRF")){
                        System.out.println(header.getName() + ": " + header.getValue());
                        csrfHeader = header.getValue();
                        csrfHeader = csrfHeader.substring(11);
                        csrfHeader = csrfHeader.substring(0, csrfHeader.length()-7);
                    }

                }


            HttpPost loginRequest = new HttpPost(userTextField.getText()+"api/authentication?username=admin&password=admin&submit=Login");
            loginRequest.setHeader("Cookie", jsessionidHeader + " CSRF-TOKEN=" + csrfHeader);
            loginRequest.setHeader("Content-type", "application/x-www-form-urlencoded");
                loginRequest.setHeader("X-CSRF-TOKEN", csrfHeader);
            HttpResponse loginResponse = null;
                loginResponse = loginClient.execute(loginRequest);
                for(Header header : loginResponse.getAllHeaders()){
//                    System.out.println(header.getName()+":"+header.getValue());
                    if(header.getName().equalsIgnoreCase("set-cookie") && header.getValue().contains("JSESSIONID")){
                        jsessionidHeader = header.getValue();
                        jsessionidHeader = jsessionidHeader.substring(0, jsessionidHeader.length()-15);
                    }
                }
                BufferedReader rd = new BufferedReader(new InputStreamReader(loginResponse.getEntity().getContent()));

                String line = "";
                while ((line = rd.readLine()) != null) {
                    System.out.println(line);
                }

                sampleResponse = loginClient.execute(sampleRequest);
                for(Header header : sampleResponse.getAllHeaders()){
                    if(header.getName().equalsIgnoreCase("set-cookie") && header.getValue().contains("CSRF")){
                        System.out.println(header.getName() + ": " + header.getValue());
                        csrfHeader = header.getValue();
                        csrfHeader = csrfHeader.substring(11);
                        csrfHeader = csrfHeader.substring(0, csrfHeader.length()-7);
                    }
                }

            } catch (IOException e) {
                e.printStackTrace();
            }


            GridPane secondaryGrid = elementFactory.createGridPane();
            String serverAddress = userTextField.getText();
            TruckSimulator truckSimulator = new TruckSimulator(serverAddress, csrfHeader, jsessionidHeader);
            Thread truckSimulatorThread = new Thread(truckSimulator);
            truckSimulatorThread.start();

            ContainerSimulator containerSimulator = new ContainerSimulator(serverAddress, csrfHeader, jsessionidHeader);
            Thread containerSimulatorThread = new Thread(containerSimulator);
            containerSimulatorThread.start();
            GridPane tempGridPane = elementFactory.createGridPane();
            Button tempBtn = new Button("Create");

            RoutesGenerator routesGenerator = new RoutesGenerator(serverAddress, csrfHeader, jsessionidHeader);

            //TRUCKS
            VBox trucksVBox = elementFactory.createVBox();
            tempGridPane = elementFactory.createGridPane();
            TextField trucksTextField = new TextField();
            trucksTextField.setText("1");
            trucksTextField.textProperty().addListener((observable, oldValue, newValue) -> {
                if (!newValue.matches("\\d+")) {
                    trucksTextField.setText(newValue.replaceAll("[^\\d]", ""));
                }
            });
            tempBtn = new Button("Create");
            tempBtn.setOnAction(event2 -> {
                System.out.println("Trucks/create");

                List<Truck> trucks = new ArrayList<>();
                int trucksNumber = Integer.parseInt(trucksTextField.getText());
                trucks = containerAndTruckFactory.createTrucks(trucksNumber);
                truckSimulator.createTrucks(trucks);
            });
            tempGridPane.add(tempBtn, 0, 0);
            Button truckSimulateBtn = new Button("Simulate");
            Button truckStopBtn = new Button("Stop");

            truckSimulateBtn.setOnAction(event2 -> {
                System.out.println("Trucks/simulate");
                truckSimulator.setRunning(true);
                truckSimulateBtn.setDisable(true);
                truckStopBtn.setDisable(false);
            });
            truckStopBtn.setDisable(true);
            truckStopBtn.setOnAction(event2 -> {
                System.out.println("Trucks/simulate");
                truckSimulator.setRunning(false);
                truckSimulateBtn.setDisable(false);
                truckStopBtn.setDisable(true);

            });
            tempGridPane.add(truckSimulateBtn, 1, 0);
            tempGridPane.add(truckStopBtn, 2, 0);
            trucksVBox.getChildren().addAll(elementFactory.createTitle("Trucks"), elementFactory.createLabel("trucks:"), trucksTextField, tempGridPane);
            secondaryGrid.add(trucksVBox, 0, 0);

            //CONTAINERS
            VBox containersVBox = elementFactory.createVBox();
            tempGridPane = elementFactory.createGridPane();
            TextField containersTextField = new TextField();
            containersTextField.setText("1");
            containersTextField.textProperty().addListener((observable, oldValue, newValue) -> {
                if (!newValue.matches("\\d+")) {
                    containersTextField.setText(newValue.replaceAll("[^\\d]", ""));
                }
            });
            tempBtn = new Button("Create");
            tempBtn.setOnAction(event2 -> {
                System.out.println("Containers/create");
                List<Container> containers = containerAndTruckFactory.createContainers(Integer.parseInt(containersTextField.getText()));
                containerSimulator.createContainers(containers);
            });
            tempGridPane.add(tempBtn, 0, 0);

            Button containerSimulateBtn = new Button("Simulate");
            Button containerStopBtn = new Button("Stop");
            containerStopBtn.setDisable(true);

            containerSimulateBtn.setOnAction(event2 -> {
                System.out.println("Containers/simulate");
                containerSimulator.setRunning(true);
                containerSimulateBtn.setDisable(true);
                containerStopBtn.setDisable(false);
            });
            containerStopBtn.setOnAction(event2 -> {
                System.out.println("Containers/simulate");
                containerSimulator.setRunning(false);
                containerSimulateBtn.setDisable(false);
                containerStopBtn.setDisable(true);

            });
            tempGridPane.add(containerSimulateBtn, 1, 0);
            tempGridPane.add(containerStopBtn, 2, 0);

            containersVBox.getChildren().addAll(elementFactory.createTitle("Containers"), elementFactory.createLabel("containers:"), containersTextField, tempGridPane);
            secondaryGrid.add(containersVBox, 0, 1);

            //ROUTES
            VBox routesVBox = elementFactory.createVBox();
            tempGridPane = elementFactory.createGridPane();
            tempGridPane.setAlignment(Pos.CENTER);
            tempBtn = new Button("Generate");
            tempBtn.setOnAction(event2 -> {
                System.out.println("Routes/generate");

                routesGenerator.generate();


            });
            tempGridPane.add(tempBtn, 0, 0);

            routesVBox.getChildren().addAll(elementFactory.createTitle("Routes"), tempGridPane);
            secondaryGrid.add(routesVBox, 0, 2);

            stage.setScene(new Scene(secondaryGrid, 350, 600));
        });
        HBox hbBtn = new HBox(10);
        hbBtn.setAlignment(Pos.BOTTOM_RIGHT);
        hbBtn.getChildren().add(btn);
        grid.add(hbBtn, 0, 2);

        stage.setScene(new Scene(grid, 300, 250));
        stage.show();
        stage.setOnCloseRequest(event -> {
            System.exit(0);
        });
    }





}
