# fuelcalc
Little JS practice to visualize current fuel consumption of a car.

Upstart script (/etc/init/fuelcalc.conf):
```
console output

start on filesystem and started networking
respawn

chdir /home/fuelcalc/fuelcalc
#cd /home/fuelcalc/fuelcalc
env NODE_ENV=production #change this to staging if this is a staging server
env PORT=3000
exec /usr/bin/node /home/fuelcalc/fuelcalc/bin/www start
´´´
