**Backend**:<br>
Step 1: Open VSCode, Clone and Fetch this branch from Github.<br>
Step 2: In VSCode terminal, make sure you're in the root folder where you can see ```requirements.txt```. <br>
Step 3: Create a virtual environment by entering in the terminal: ```pipenv shell```.<br>
(Assumming you already installed ```pipenv``` and ```pip```.)<br>
Step 4: Install requirements by entering: ```pip install -r requirements.txt```.<br>
Step 5: (Optional) In the terminal, enter ```coverage run manage.py test``` to run unit tests, <br>
then enter ```coverage report``` to see % code coverage.<br><br>

**Connect to PostgreSQL database on Railway.app**:<br>
Step 1: Create a ```.env``` file in the root folder, put in: <br>
```DATABASE_URL=postgresql://postgres:HHCrPfBGsFSYqfWYNxrXQpzGFBlESOmM@roundhouse.proxy.rlwy.net:33804/railway```, then save.<br>
Step 2: Open ```backend\settings.py```, then **un-comment** these two lines (64, 65):<br>
```database_url = os.environ.get('DATABASE_URL')``` <br>
```DATABASES["default"] = dj_database_url.parse(database_url)```<br>
(by removing the ```#``` before each of them, then save the file)<br>
Step 3: In the terminal, enter ```python manage.py runserver``` to start the backend server with port 8000.<br><br>

**Frontend**:<br>
Step 1: Open another VSCode Terminal, enter ```cd frontend``` to go inside the ```frontend``` folder.<br> 
Step 2: Create a ```.env``` file inside the ```frontend``` folder, <br>
put in ```REACT_APP_API_BASE_URL=http://localhost:8000/api```, then save.<br>
Step 3: In the terminal, enter ```npm ci```, then ```npm start```.<br>
Step 4: Open ```localhost:3000``` and try out the features.<br><br>

**Note:** May have to install missing packages and modules: try to Google the errors and solutions/commands to install packages are usually on Stackoverflow.
<br>

**Available Features:**<br>
    - Log in / Register <br>
    - Profile Management <br>
    - Request a Quote <br>
    - Quote History <br>
    - Pricing Module<br>
    - Unit Tests with Code Coverage over 90%<br>

**Project Deployment URL:** https://pa.lemonadess.com/ <br><br>

