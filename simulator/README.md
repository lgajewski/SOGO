
## Run

Build an application:

> mvn clean install

Run application from jar

> java -jar application/target/application-1.0-SNAPSHOT-jar-with-dependencies.jar



### Troubleshooting

If there would be a problem with indexing, ensure that MongoDB is indexed before first start:

> db.container.ensureIndex( { location : "2d" } );

