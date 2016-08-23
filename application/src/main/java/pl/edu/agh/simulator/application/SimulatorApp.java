package pl.edu.agh.simulator.application;

import com.google.gson.Gson;
import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import pl.edu.agh.simulator.domain.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class SimulatorApp extends Application {

    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage primaryStage) {

        primaryStage.setTitle("SOGO Simulator");
        GridPane grid = createGridPane();
        grid.setAlignment(Pos.CENTER);
        Text sceneTitle = new Text("Server address");
        sceneTitle.setFont(Font.font("Tahoma", FontWeight.NORMAL, 20));
        grid.add(sceneTitle, 0, 0, 2, 1);

        TextField userTextField = new TextField();
        userTextField.setText("http://localhost/");
        grid.add(userTextField, 0, 1);

        Button btn = new Button("Enter");
        btn.setOnAction(event -> {
            System.out.println(userTextField.getText());
            Gson gson = new Gson();
            GridPane secondaryGrid = createGridPane();
            String serverAddress = userTextField.getText();
            TruckSimulator truckSimulator = new TruckSimulator(serverAddress);
            Thread truckSimulatorThread = new Thread(truckSimulator);
            truckSimulatorThread.start();

            ContainerSimulator containerSimulator = new ContainerSimulator(serverAddress);
            Thread containerSimulatorThread = new Thread(containerSimulator);
            containerSimulatorThread.start();
            GridPane tempGridPane = createGridPane();
            Button tempBtn = new Button("Create");

            //TRUCKS

            VBox vbox2 = createVBox();
            tempGridPane = createGridPane();
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
                try {
                    HttpClient client = HttpClientBuilder.create().build();

                    HttpPost request = new HttpPost(serverAddress+"trucks");
                    List<Truck> trucks = new ArrayList<>();
                    trucks = createTrucks(Integer.parseInt(trucksTextField.getText()));
                    for (Truck truck : trucks) {
                        StringEntity params = new StringEntity(gson.toJson(truck));
                        System.out.println(gson.toJson(truck));
                        request.addHeader("Content-type", "application/json");
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
            vbox2.getChildren().addAll(createTitle("Trucks"), createLabel("trucks:"), trucksTextField, tempGridPane);
            secondaryGrid.add(vbox2, 0, 0);


            //CONTAINERS

            VBox vbox3 = createVBox();
            tempGridPane = createGridPane();
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
                try {

                    HttpClient client = HttpClientBuilder.create().build();

                    HttpPost request = new HttpPost(serverAddress+"containers");

                    List<Container> containers = createContainers(Integer.parseInt(containersTextField.getText()));
                    for (Container container : containers) {
                        StringEntity params = new StringEntity(gson.toJson(container));
                        System.out.println(gson.toJson(container));
                        request.addHeader("Content-type", "application/json");
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

            vbox3.getChildren().addAll(createTitle("Containers"), createLabel("containers:"), containersTextField, tempGridPane);
            secondaryGrid.add(vbox3, 0, 1);

            //ROUTES
            VBox vbox4 = createVBox();
            tempGridPane = createGridPane();
            tempGridPane.setAlignment(Pos.CENTER);
            tempBtn = new Button("Generate");
            tempBtn.setOnAction(event2 -> {
                System.out.println("Routes/generate");
                try {

                    HttpClient client = HttpClientBuilder.create().build();

                    HttpPost request = new HttpPost(serverAddress+"routes/generate");

                    request.addHeader("Content-type", "application/json");
                    HttpResponse response = client.execute(request);

                    BufferedReader rd = new BufferedReader (new InputStreamReader(response.getEntity().getContent()));

                    String line = "";
                    while((line = rd.readLine()) != null) {
                        System.out.println(line);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
            tempGridPane.add(tempBtn, 0, 0);

            vbox4.getChildren().addAll(createTitle("Routes"), tempGridPane);
            secondaryGrid.add(vbox4, 0, 2);

            primaryStage.setScene(new Scene(secondaryGrid, 350, 600));
        });
        HBox hbBtn = new HBox(10);
        hbBtn.setAlignment(Pos.BOTTOM_RIGHT);
        hbBtn.getChildren().add(btn);
        grid.add(hbBtn, 0, 2);
        primaryStage.setScene(new Scene(grid, 300, 250));
        primaryStage.show();
        primaryStage.setOnCloseRequest(event -> {
            System.exit(0);
        });
    }


    private HBox createHBox(Button... btn) {
        HBox hbBtn = new HBox(10);
        hbBtn.setAlignment(Pos.BOTTOM_RIGHT);
        hbBtn.getChildren().addAll(btn);
        return hbBtn;
    }

    private Text createTitle(String title){
        Text userTitle = new Text(title);
        userTitle.setFont(Font.font("Tahoma", FontWeight.NORMAL, 20));
        return userTitle;
    }

    private Label createLabel(String text){
        Label label = new Label();
        label.setText(text);
        return label;
    }

    private VBox createVBox() {
        VBox vbox = new VBox();
        vbox.setSpacing(5);
        vbox.setPadding(new Insets(10, 0, 0, 10));
        vbox.setStyle("-fx-padding: 10;" +
                "-fx-border-style: solid inside;" +
                "-fx-border-width: 2;" +
                "-fx-border-insets: 5;" +
                "-fx-border-radius: 5;" +
                "-fx-border-color: grey;");
        return vbox;
    }

    private GridPane createGridPane(){
        GridPane gridPane = new GridPane();
        gridPane.setHgap(10);
        gridPane.setVgap(10);
        gridPane.setPadding(new Insets(25, 25, 25, 25));
        return gridPane;
    }

    private List<User> createUsers(int number){
        List<User> users = new ArrayList<>();
        for(int i=0;i < number; i++){
            User user = new User();
            user.setUsername("janek"+i);
            user.setEmail("przykladowyEmail"+i+"@123.pl");
            user.setFirstName("Jan");
            user.setLastName("Kowalski"+i);
            user.setEnabled(i<7);
            user.setPassword("najlepszehaslonaswiecie");
        }
        return users;
    }

    private List<Truck> createTrucks(int number){
        Random r = new Random();
        List<Truck> trucks = new ArrayList<>();
        for(int i=0;i < number; i++) {
            Truck truck = new Truck("KRA "+r.nextInt(10)+r.nextInt(10)+r.nextInt(10)+r.nextInt(10), r.nextInt(1000)+1000);
            truck.setLocation(new Location(50.047+(r.nextDouble()*24/1000), 19.915+(r.nextDouble()*54/1000)));
            truck.setUser(null);
//            truck.setCapacity(1000+i);
            truck.setLoad(r.nextInt(1000));
            trucks.add(truck);
        }
        return trucks;
    }

    private List<Container> createContainers(int number){
        Random r = new Random();
        String[] types = {"blue", "green", "yellow"};
        List<Container> containers = new ArrayList<>();
        for(int i=0;i < number; i++) {
            Container container = new Container();

            container.setCapacity(100+i);
            container.setType(types[r.nextInt(3)]);
            Sensor loadSensor = new Sensor<Double>();
            loadSensor.setErrorCode(0);
            loadSensor.setValue(r.nextDouble()*100);
            container.addSensor("load", loadSensor);

            Sensor smellSensor = new Sensor<Double>();
            smellSensor.setErrorCode(0);
            smellSensor.setValue(r.nextInt(10));
            container.addSensor("smell", smellSensor);

            Sensor deviceSensor = new Sensor<Integer>();
            deviceSensor.setErrorCode(1);
            deviceSensor.setValue(r.nextInt(100));
            container.addSensor("device", deviceSensor);
            container.setLocation(new Location(50.047+(r.nextDouble()*24/1000), 19.915+(r.nextDouble()*54/1000)));

            containers.add(container);
        }
        return containers;
    }
}
