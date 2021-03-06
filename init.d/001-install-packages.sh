#!/bin/bash

sleep 5
apt-get update
sleep 5

echo "--> Installing Apache, PHP, and friends"
apt-get install -y apache2 php5 libapache2-mod-php5 php5-curl python-pip

echo "--> Enabling mod_rewrite"
a2enmod rewrite

echo "--> Installing requests"
pip install requests

echo "--> Setting up the site"
echo '<VirtualHost *:80>
        ServerName tapin.tv
        ServerAlias *.tapin.tv

        ErrorLog /var/log/apache2/error.log
        CustomLog /var/log/apache2/access.log combined

        DocumentRoot /var/www
        <Directory /var/www/>
                Options FollowSymLinks
                AllowOverride All
        </Directory>
</VirtualHost>' > /etc/apache2/sites-available/default

echo "--> Restarting apache"
service apache2 restart
