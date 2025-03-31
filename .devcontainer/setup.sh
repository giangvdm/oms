#!/bin/bash

# Installing NPM dependencies
# cd app
npm install

# Setting up SSH key
mkdir -p /root/.ssh
cp /tmp/.ssh/id_ed25519 /root/.ssh/id_ed25519
cp /tmp/.ssh/id_ed25519.pub /root/.ssh/id_ed25519.pub
cp /tmp/.ssh/known_hosts /root/.ssh/known_hosts 2>/dev/null || true

# chmod 700 /root/.ssh
# chmod 600 /root/.ssh/id_ed25519 
# chmod 644 /root/.ssh/id_ed25519.pub 
# chmod 644 /root/.ssh/known_hosts