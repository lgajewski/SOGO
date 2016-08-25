package pl.edu.agh.simulator.application;

import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.Text;
import pl.edu.agh.simulator.domain.User;

import java.util.ArrayList;
import java.util.List;

public class ElementFactory {

    public List<User> createUsers(int number){
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


    public HBox createHBox(Button... btn) {
        HBox hbBtn = new HBox(10);
        hbBtn.setAlignment(Pos.BOTTOM_RIGHT);
        hbBtn.getChildren().addAll(btn);
        return hbBtn;
    }

    public Text createTitle(String title){
        Text userTitle = new Text(title);
        userTitle.setFont(Font.font("Tahoma", FontWeight.NORMAL, 20));
        return userTitle;
    }

    public Label createLabel(String text){
        Label label = new Label();
        label.setText(text);
        return label;
    }

    public VBox createVBox() {
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

    public GridPane createGridPane(){
        GridPane gridPane = new GridPane();
        gridPane.setHgap(10);
        gridPane.setVgap(10);
        gridPane.setPadding(new Insets(25, 25, 25, 25));
        return gridPane;
    }
}
