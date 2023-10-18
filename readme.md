# CLLeMens Project

## Prerequisites

- Python 3.10.13
- Node.js and npm
- Django package for the backend

## Installation and Setup

Clone the repository and navigate into the project directory.

### Backend Setup (CLLeMensWebServer)

1. Navigate into the `CLLeMensWebServer` directory:
    ```bash
    cd CLLeMensWebServer
    ```

2. Create and activate a virtual environment, or use a conda environment:

    **Virtual Environment**
    ```bash
    python3 -m venv your_virtual_env
    source your_virtual_env/bin/activate  # On Unix or macOS
    ```
    Or
    ```bash
    your_virtual_env\Scripts\activate  # On Windows
    ```

    **Conda Environment**
    ```bash
    conda create --name your_conda_env
    conda activate your_conda_env
    ```

3. Install the required packages:
    ```bash
    pip install -r requirements.txt
    ```

4. Load DB from Dump:
    ```bash
    cd scripts
    docker-compose up -d db_load
    ```

5. Run the Django server:
    ```bash
    python manage.py runserver
    ```


   

### Frontend Setup (CLLeMensWebClient)

1. Open a new terminal and navigate into the `CLLeMensWebClient` directory:
    ```bash
    cd CLLeMensWebClient
    ```

2. Install npm packages:
    ```bash
    npm install
    ```

3. Run the React development server:
    ```bash
    npm run dev
    ```



Both servers should now be running. Open your web browser and navigate to the respective URL to use the application.
- The backend server will run on Port 8000. 
- The frontend will run on Port 3000.


## If you change the DB remember to re-dump it (docker-compose up -d db_dump)