# SOGO [![Build Status](https://travis-ci.com/lgajewski/SOGO.svg?token=1uAapbtqAhxi51os5v63&branch=master)](https://travis-ci.com/lgajewski/SOGO)

System optymalizujący gospodarkę odpadami

<br/>

### Running

To run application in place, go to the root directory and run:

> ./gradlew bootRun

- Make sure to have MongoDB started on port 27017.

<br/>

### Testing

There is already written script, which starts the application and run UI tests locally.
Only execute shell script to start:

> ./scripts/run-tests.sh


<br/>

### Deployment

SOGO is already prepared to being deployed on external server.
Type below command to automatically clean your repository, build .war file, upload it and restart SOGO service on the server:

- [nat-1.d17.iisg.agh.edu.pl:60680](http://nat-1.d17.iisg.agh.edu.pl:60680/)

Make sure to update **SSH password** with current one!

> ./gradlew clean deploy -Pssh.password=_[SSH_PASSWORD]_
