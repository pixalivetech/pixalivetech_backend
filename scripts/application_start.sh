#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/ec2-user/backend

#navigate into our working directory where we have all our github files
cd /home/ec2-user/backend

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

# Install Node modules
sudo npm install

# Start our Node app with PM2
# sudo pm2 start npm --name api -- run dev

# Restart our node app with PM2
sudo pm2 restart api