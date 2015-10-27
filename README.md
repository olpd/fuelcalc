# fuelcalc
Little JS practice to visualize current fuel consumption of a car.
# Prerequisites
There are a few things that need to be done in order to run fuel calc.
## CouchDB
CouchDB needs to be running on the same machine as fuelcalc and needs a DB called 'fuelcalc'
```
> sudo apt-get install couchdb
> curl -X PUT http://localhost:5984/fuelcalc
```

## Upstart script (/etc/init/fuelcalc.conf):
```
console output

start on filesystem and started networking
respawn

chdir /home/fuelcalc/fuelcalc
#cd /home/fuelcalc/fuelcalc
env NODE_ENV=production #change this to staging if this is a staging server
env PORT=3000
exec /usr/bin/node /home/fuelcalc/fuelcalc/bin/www start
```

