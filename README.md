# DNF-webapp
Web-application for Drug Network Fusion (DNF)


# Installation Instructions
1) Install node.js 
2) cd into the app folder 
3) run 'npm install'  
4) run 'bower install' 
5) run 'grunt serve' to launch the app.

# Deploy instructions
First create the distribution version of the project by running "grunt". 
Then cd into the dist folder and run, git remote add prod https://git.heroku.com/dnftest.git. 
To deploy, run grunt buildcontrol:heroku.