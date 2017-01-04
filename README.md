# DNF-webapp
Web-application for Drug Network Fusion (DNF)


# Installation Instructions
1. Install the latest version of Node.js (https://nodejs.org/en/).
2. On your terminal, cd into src/app/
3. For Windows machines, run the command 'npm install' on your terminal (or sudo npm install if using a Mac). 
4. Run the command 'bower install' on your terminal.
5. Run 'grunt serve' to launch the application. 

# Deployment Instructions
1. First create the distribution version of the project by running "grunt". 
2. Then cd into the dist folder and run, git remote add prod https://git.heroku.com/dnftest.git. (only needs to be done once--setting the remote) 
3. To deploy, run grunt buildcontrol:heroku.

# Application Link
dnfwebapp.herokuapp.com
