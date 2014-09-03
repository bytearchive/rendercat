#!/bin/bash
cd $(dirname $0)
cd ..
sudo groupadd worker
sudo useradd worker -s /bin/false -m -g worker -G worker
sudo apt-get install -y lxc-docker
sudo chmod 777 /var/run/docker.sock
git clone git://git.cazcade.com/root/worker-docker-image.git
docker build -rm  -t worker .

sudo useradd worker
if  grep "Match User worker" /etc/ssh/sshd_config 
then 
	echo "SSHD change already installed"
else
	sudo echo 'Match User worker' >> /etc/ssh/sshd_config
	sudo echo 'ForceCommand docker run --rm=true worker $SSH_ORIGINAL_COMMAND' >> /etc/ssh/sshd_config
	sudo service ssh restart
fi
