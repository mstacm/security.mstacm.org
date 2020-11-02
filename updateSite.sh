#!/bin/bash
ssh -tt ctf-admin@acmvm2.srv.mst.edu << EOF
cd /var/www/acmsec.mst.edu
sudo git pull origin master
exit
EOF
