#!/bin/bash
ssh -tt ctf-admin@acmvm2.srv.mst.edu << EOF
cd /var/www/acmsigsec.mst.edu
sudo git pull origin groupEffort
EOF
