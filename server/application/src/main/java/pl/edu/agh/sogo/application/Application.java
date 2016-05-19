package pl.edu.agh.sogo.application;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication
@ImportResource("classpath:pl/edu/agh/sogo/application/beans.xml")
public class Application extends SpringBootServletInitializer{


    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }


    }


