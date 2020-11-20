
# IT-Project-COMP30022 - eProfolio.pro

## Table of Contents
  * [Project Overview](#project-overview)
  * [Demo](#demo)
  * [Features](#features)
  * [Changelog](#changelog)
  * [Documentation](#documentation)
  * [Current Bugs](#current-bugs)
  * [Installing and Deploying](#installing-and-deploying)
  * [Licensing Agreements](#licensing-agreements)

## Project Overview

This project comes from COMP30022, a subject titled "IT Project" from the University of Melbourne. In this semester (Semester 2, 2020) our goal was to create a platform based around ePortfolios. 

This is recommended to view on desktop only. This application is NOT mobile-compatible.

**Student Info** (Name | Student ID | Student Email)
1. Caitlin Grant | 911075 | caitling1@student.unimelb.edu.au 
2. Raphael Wirth | 911436 | rwirth@student.unimelb.edu.au 
3. Zhi Charles Teoh | 899991 | teohz2@student.unimelb.edu.au 
4. Elijah Nicol | 995961 | ejnicol@student.unimelb.edu.au 
5. Connor Rockliff | 901313 | crockliff@student.unimelb.edu.au

## Demo
The website can be found at: eprofolio.pro

## Features

 1. Simple-to-use portfolio editor 
 2. Ability to embed images 
 3. Capable of hosting multiple ePortfolios to one account
 4. Custom templates
 5. Template recommendations
 6. Custom templates
 7. Rate different templates
 8. Ability to export portfolio as a .pdf file

## Changelog
Changes can be found in Releases.

A short overview can be read here:

**Sprint 1**

* Initialised Backend/Frontend
* Initialised Database
* Client's requirements recorded
* Wireframe UI developed for Client


**Sprint 2**

* Domain Name purchased
* SSL Certificate purchased
* Backend routes configured
* Backend passwords encrypted
* Backend web tokens utilised
...

**Sprint 3**

* Fetch/Delete/Save Templates implemented
* Fetch/Delete/Save Eportfolios implemented
* Added ability to save work within text workspace
* Added ability to create templates from the workspace
* Added ability to create folios from the workspace
* Functionality added to templates page
* Deployed backend onto AWS, and frontend to eprofolio.pro
....

## Documentation
Can be found in the docs/ folder. 

The following documentation exists:

 - Do/Be/Feel List
 - User Stories


## Current Bugs
- Images uploaded to the editor do not display correctly in the PROD environment


## Installing and Deploying
This outlines how to install and deploy the application on a local server with only the source-code.

**Requirements**

 - MongoDB atlas account
 - NPM

**Steps**
1. Create a new cluster in MongoDB with a username and password
2. Create a .env file in the Backend folder with the contents
 `DATABASE_USER = <YOUR_USERNAME>
  DATABASE_PASS = <YOUR_PASSWORD>`
3. Edit the DB connection configuration in Backend/models/db.js to point to the newly created database (dbName)
4. Run 'npm install' in the Backend folder to install the dependencies
5. Run npm start to start the backend server
6. Change directory to the Frontend folder and run 'npm install' to install depdendencies 
7. Create an .env file with the contents `BASE_URL = "<BACKEND_SERVER>"`
8. Run npm start to start the web server
9. Open any browser and go to web server address
10. Done!


## Licensing Agreements
This application cannot be used commercially.
