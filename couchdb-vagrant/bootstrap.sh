sudo apt-get update
sudo apt-get install software-properties-common -y
sudo add-apt-repository ppa:couchdb/stable -y
sudo apt-get update
sudo apt-get install couchdb -y
sudo sed -i -e"s/^bind_address\s*=\s*127.0.0.1/bind_address = 0.0.0.0/" /etc/couchdb/default.ini
sudo service couchdb restart
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g add-cors-to-couchdb
sudo add-cors-to-couchdb
sudo service couchdb restart
sleep 5
cd /vagrant
bash couchdb-backup.sh -r -H 127.0.0.1 -d ledgr -f ledgr.json