#!/bin/bash

echo "Schedule run Spring Boot application."
sleep 3s

echo "Spring Boot has been started in the background."
./gradlew bootRun &
bootPid=$!

echo "Waiting for application warmup..."
sleep 60s

echo "Execution of Protractor e2e tests"
npm test
RESULT=$?

echo "Kill Spring Boot application."
kill -9 $bootPid

exit $RESULT
