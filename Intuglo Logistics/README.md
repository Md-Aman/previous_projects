
<div align="center">
  <img src="https://github.com/Siroi-Solutions/IntugloLogistics/blob/master/src/assets/img/IntugloLogo.png" width="300" alt="Intuglo Logistics">
  <br>
  <h1>Intuglo Logistics</h1>
</div>

# Welcome to Intuglo Logistics

## Installation Guide 

### Installation of Softwares
 *Step 1: Visual Studio (VS) Code*
_Current IDE that we are using for this development are VS Code Your free to use any other ide’s that your comfortable with as long as it suits our development needs_

*Step 2: Installation needed as extensions at Visual Code*
```markdown

| Title            | Publisher Name                                          |
| ----------------- | ------------------------------------ | 
| Angular 5 and TypeScript/HTML VS Code Snippets    | By Dah Wahlin               |                                                             |
| Auto Import       | By Steoates     |                                                             
|
| Code Runner           | By Jun Han                                                                                                            |
| Magic Python   | By MagicStack Inc.
|
| MySQL    | By Jun Han                        | 
|                                                                          
|
```

*Step 3: Memcached*
Please download the latest version of memcached as we are using this to track our session
```markdown
[Memcached download here](https://commaster.net/content/installing-memcached-windows)
```
Unzip the folder and place them somewhere you can easily access it.
To run memcache open the terminal from the location you stored memcached.exe 
```markdown
- Bulleted
Navigate your way to backend folder on your local and search for memcacheResource.py script
```

### Installation of Front End

To ensure the whole project running successfully, there are packages needed to be installed first in order for all the dependencies to work properly. For front end particularly we're using Angular as our framework. 

*Step 1: Installation of Angular Framework*
```markdown
npm install -g @angular/cli
```

*Step 2: Installation of Typescript*
```markdown
npm install -g typescript
```

*Step 3: Installation command needed from CLI*
```markdown
| Package Name            | CLI Command                                     |
| ----------------- | ------------------------------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| font-awesome    | npm install --save font-awesome |
|

_to be continue...._
```

_Alternative (just copy this one):_
```markdown
npm install font-awesome angular-font-awesome ngx-pagination @angular/cdk @angular/material @angular/animations ng-sidebar @swimlane/ngx-datatable angular2-datatable ng2-select ng2-completer ng-invalid-tooltip ngx-modal pdfmake ng2-ion-range-slider ng2-timezone-selector ngx-toastr ng-bootstrap-form-validation  ngx-papaparse@2 events buffer stream timers ng2-auto-complete --save 
```

After all of the installation finished, we need
*Step 4: To run the project, to serve them*
Run at the terminal node with command:
```markdown
 _ng serve_  
 ```
- to serve the project via dedicated localhost.


If running the application on local server, there are 3 things need to be make sure it’s running:
1. Waitress
```markdown
Run using this command:
Waitress-serve --listen=127.0.0.1:8000 IntugloApp:IntugloLogistics
```
2. Memcached
Change your directory to local memcached file. (Usually on C:/)
Run using this command:
```markdown
Memcached.exe -m 512
```


### Installation of Back End

*Step 1: Installation of Python Environment*
Please download Python 3.5.2 from the below link according to your operating system.  
Please download 32bit version of python for all versions of windows 32/64 bit 
```markdown
[Python 3.5.2 download here](https://www.python.org/downloads/release/python-352/)
```

Edit to your environment variables with Python Path

The installation should be very straight-forward as the installer will give you easy and simple instruction. 
After successful installation please open terminal and check if pip are working by giving this command:
```markdown
pip -V 
```

_The output should return the version of pip and python your running_

*Step 2: Installation of Python Packages*
After confirming pip is working please go head and install the mentioned packages. 
```markdown
pip install python-memcached 
pip install falcon 
pip install waitress 
pip install falcon_multipart 
pip install pymysql 
pip install fpdf 
pip install simplejson 
pip install setuptools
```

### Installation of Databases

*Step 1: Installation of MySQL*
Please download the MySQL Community 5.7 and install all the packages that comes with the installer Its important to also install mysql-workbench
```markdown
[MySQL Community 5.7 download here](https://dev.mysql.com/downloads/mysql/5.7.html#downloads)
```

*Step 2: Installation of MySQL connector c6.0.2*
This is an additional package to install aside from MYSQL community server. 
```markdown
[MySQL Connector/Python download here](https://dev.mysql.com/downloads/connector/python/)
```

*Step 3: Created schema of Intuglo Logistics*
1. Get the Database Scripts from database folder.
2. Create Schema named,
```markdown
intuglo_logistics
```
3. Query for tables will be in this file called IntugloLogistics_Table, copy all, paste & run in MySQL Workbench.
4. For population of data, it will be in this file called IntugloLogistics_DataPopulation, copy all, paste & run in MySQL Workbench.



