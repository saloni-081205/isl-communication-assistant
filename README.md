# AI-Powered Indian Sign Language Communication Assistant

A full-stack application that helps bridge the communication gap between Indian Sign Language (ISL) users and people who do not understand sign language. The system recognizes hand gestures, generates English sentences from recognized words, and supports multilingual communication.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Clone the Repository](#clone-the-repository)
- [Backend Setup](#backend-setup)
- [AI Service Setup](#ai-service-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Complete Application](#running-the-complete-application)
- [API Endpoints](#api-endpoints)
- [Model and Dataset Requirements](#model-and-dataset-requirements)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)
- [Future Improvements](#future-improvements)
- [Contributors](#contributors)

---

## Project Overview

The AI-Powered Indian Sign Language Communication Assistant is a final-year engineering project designed to make communication more accessible for people who use Indian Sign Language.

The application combines computer vision, machine learning, natural language processing techniques, and web technologies to recognize gestures and convert recognized signs into readable text.

The system includes two separate recognition modules:

1. **Static Gesture Recognition:** Recognizes individual hand gestures, including alphabetic signs A–Z and numeric signs 0–9.
2. **Dynamic Gesture Recognition:** Recognizes gestures involving movement over a sequence of video frames using a temporal machine learning model.

Recognized words can be used to generate English sentences. The application also supports Hindi and Gujarati translations, along with text-to-speech functionality where supported by the browser.

## Features

### 1. Static Gesture Recognition
- Recognizes supported static ISL hand gestures.
- Supports alphabetic signs A–Z and numeric signs 0–9.
- Uses MediaPipe hand landmarks and a trained machine learning model.
- Displays the predicted sign and its confidence score.

### 2. Dynamic Gesture Recognition
- Recognizes supported gestures that involve movement over time.
- Extracts hand landmark sequences from video frames.
- Uses an LSTM-based model for temporal gesture classification.
- Keeps dynamic recognition separate from static recognition.

### 3. English Sentence Generation
- Converts recognized words or gesture sequences into readable English sentences.
- Uses rule-based sentence generation for supported phrases and contexts.
- The quality and variety of generated sentences depend on the implemented rules and supported vocabulary.

### 4. Multilingual Translation
- Supports Hindi translation.
- Supports Gujarati translation.
- Displays translated text when a translation is available.

### 5. Text-to-Speech
- Reads supported text aloud using browser speech capabilities.
- Available voices depend on the operating system and browser.

### 6. User Authentication
- Provides registration and login functionality.
- Uses JWT-based authentication and password hashing in the backend.

### 7. Responsive User Interface
- Built with React and Tailwind CSS.
- Includes light and dark themes.
- Designed to work across supported desktop and mobile screen sizes.

## System Architecture

The application uses three main services.

```text
+------------------------------+
|     React + Vite Frontend    |
|                              |
| Camera UI, Results, Text,     |
| Translations and Speech      |
+---------------+--------------+
                |
                | HTTP / Axios
                v
+------------------------------+
|      Node.js + Express       |
|                              |
| Authentication, JWT, APIs,   |
| MySQL and AI Service Proxy   |
+---------------+--------------+
                |
                | HTTP / Multipart
                v
+------------------------------+
|       Python FastAPI         |
|                              |
| MediaPipe, OpenCV, ML Models |
| Static and Dynamic Prediction|
+------------------------------+

          +----------------+
          |     MySQL      |
          | User and       |
          | Application Data|
          +----------------+
```

**Important architecture rule:** The React frontend communicates with the Express backend. Express communicates with the FastAPI AI service. The frontend should not call FastAPI directly.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript, Tailwind CSS, Axios, React Router |
| Backend | Node.js, Express.js, JWT |
| Database | MySQL |
| AI API | Python, FastAPI, Uvicorn |
| Computer Vision | OpenCV, MediaPipe |
| Machine Learning | scikit-learn, TensorFlow/Keras |
| Static Recognition | MediaPipe landmarks and Random Forest model |
| Dynamic Recognition | Landmark sequences and LSTM model |
| Version Control | Git and GitHub |

## Project Structure

The main directories are organized as follows. Exact filenames may vary with the current implementation.

```text
AI-ISL-Communication-Assistant/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── config/
│   ├── app.js
│   ├── package.json
│   └── .env.example
│
├── ai-service/
│   └── isl-gesture-recognition/
│       ├── src/
│       │   ├── api.py
│       │   ├── config.py
│       │   ├── extract_landmarks.py
│       │   ├── landmarks_preprocess.py
│       │   ├── prediction_service.py
│       │   ├── realtime_prediction.py
│       │   └── train_model.py
│       │
│       ├── dynamic-module/
│       │   ├── src/
│       │   │   ├── config.py
│       │   │   ├── extract_landmarks_video.py
│       │   │   ├── preprocess_dynamic.py
│       │   │   ├── preprocess_utils.py
│       │   │   ├── realtime_exp_dynamic.py
│       │   │   └── train_lstm.py
│       │   ├── requirements.txt
│       │   └── README.md
│       │
│       ├── requirements.txt
│       └── README.md
│
├── .gitignore
└── README.md
```

Some names above are illustrative. Refer to the actual files in the repository if a filename differs.

---

## Prerequisites

Install the following software before running the project.

### 1. Git

Download and install Git:

https://git-scm.com/downloads

Verify the installation:

```bash
git --version
```

### 2. Node.js and npm

Install a compatible Node.js LTS release:

https://nodejs.org/

Verify:

```bash
node --version
npm --version
```

Use a Node.js version supported by the frontend and backend dependencies.

### 3. Python

The AI service was developed using **Python 3.10.11**. Using the same Python version is recommended, especially for TensorFlow and MediaPipe compatibility.

Download Python:

https://www.python.org/downloads/release/python-31011/

Verify:

```bash
python --version
```

On Windows, if `python` does not point to Python 3.10, try:

```powershell
py -3.10 --version
```

### 4. MySQL

Install MySQL Server and MySQL Workbench:

https://dev.mysql.com/downloads/

You need a running MySQL server and a database user with permission to create or access the application's database.

### 5. Webcam

A working webcam is required for live gesture recognition through the browser. Camera access must be allowed by the browser, and the operating system must detect the camera.

---

## Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/saloni-081205/isl-communication-assistant.git
cd isl-communication-assistant
```

If you use VS Code, open the project folder:

```bash
code .
```

Before continuing, confirm that the `frontend`, `backend`, and `ai-service/isl-gesture-recognition` directories exist.

---

## Backend Setup

The backend handles authentication, database operations, application APIs, and communication with the AI service.

### Step 1: Open the backend directory

```bash
cd backend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Configure environment variables

Create a local `.env` file in the `backend` directory. Use `.env.example` as a reference if it exists.

Example configuration:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=isl_communication_assistant
JWT_SECRET=replace_with_a_long_random_secret
FASTAPI_URL=http://localhost:8000
```

**Important:** These are example values. Check the backend source code and its existing environment-variable names. If the application uses different names or a different port, use those names and values instead.

Replace the example database credentials and JWT secret with your local configuration. Do not upload your actual `.env` file to GitHub.

### Step 4: Create the database

Open MySQL Workbench and connect to your MySQL server.

Create the database:

```sql
CREATE DATABASE isl_communication_assistant;
```

If the project includes SQL schema or migration files, execute those files to create the required tables.

If the schema is not included, the required tables must be created using the schema expected by the backend. Creating the database alone does not automatically create application tables.

### Step 5: Start the backend

Check `backend/package.json` for the available scripts. Common commands are:

```bash
npm run dev
```

or:

```bash
npm start
```

Use whichever script is actually defined in the repository.

Keep the terminal running.

The backend must be able to connect to MySQL and reach the FastAPI service when AI functionality is used.

---

## AI Service Setup

The AI service contains the static and dynamic gesture-recognition code.

### Step 1: Navigate to the AI service

Open a new terminal from the project root:

```bash
cd ai-service/isl-gesture-recognition
```

### Step 2: Create a Python virtual environment

On Windows:

```powershell
py -3.10 -m venv venv
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks script activation, you may use Command Prompt instead:

```bat
venv\Scripts\activate.bat
```

On macOS or Linux:

```bash
python3.10 -m venv venv
source venv/bin/activate
```

### Step 3: Install AI dependencies

With the virtual environment activated:

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

If the dynamic module has its own dependency file, check whether it contains additional packages:

```text
ai-service/isl-gesture-recognition/dynamic-module/requirements.txt
```

Install any additional required packages that are not already included in the main requirements file.

For example:

```bash
pip install -r dynamic-module/requirements.txt
```

Do not install two conflicting versions of TensorFlow, MediaPipe, or other packages into the same environment. If the dependency files specify incompatible versions, follow the versions documented for each module and configure separate virtual environments when necessary.

### Step 4: Check model files

The AI service needs the trained model files and label encoders expected by its prediction code.

Examples of model artifacts used by this project include:

- Static recognition: `random_forest_model.pkl`, `label_encoder.pkl`, and any required model metadata.
- Dynamic recognition: `lstm_model.keras`, `dynamic_label_encoder.pkl`, and any other artifacts required by the prediction implementation.

Check the `models/` directories and the model paths configured in the source code.

If required artifacts are not included in the repository, you must obtain them from the project maintainers or generate them by following the corresponding training scripts and dataset instructions. Installing Python dependencies alone does not produce trained models.

### Step 5: Start the FastAPI service

Inspect `src/api.py` to confirm the FastAPI application object and supported endpoints.

If the application object is named `app`, a typical command is:

```bash
uvicorn src.api:app --host 127.0.0.1 --port 8000 --reload
```

Run this command from the `isl-gesture-recognition` directory.

If your FastAPI application object or module path differs, adjust the command accordingly.

When the server starts, open:

http://127.0.0.1:8000/docs

The interactive documentation will show the endpoints exposed by the running API.

Keep the terminal running.

**Note:** Starting FastAPI successfully does not guarantee that both recognition models are loaded. Check the startup logs and test the relevant prediction endpoints.

---

## Frontend Setup

### Step 1: Open a new terminal

From the repository root:

```bash
cd frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Configure frontend environment variables

Check the frontend source code to determine whether it uses a Vite environment variable for the Express API URL.

If it expects `VITE_API_URL`, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Use the variable name expected by the actual frontend code. Do not create an unused variable and assume the frontend will automatically read it.

### Step 4: Start the frontend

```bash
npm run dev
```

Vite will display a local development URL, commonly:

http://localhost:5173

Open the URL shown in your terminal.

Allow camera access when prompted by the browser.

---

## Running the Complete Application

For local development, run each service in its own terminal.

| Terminal | Directory | Purpose |
|---|---|---|
| 1 | `backend/` | Express backend and MySQL integration |
| 2 | `ai-service/isl-gesture-recognition/` | FastAPI and AI inference |
| 3 | `frontend/` | React + Vite interface |

Start the services in this order:

1. Start MySQL Server.
2. Start the FastAPI AI service.
3. Start the Express backend.
4. Start the React frontend.
5. Open the frontend URL in your browser and test the application.

The Express backend must point to the correct FastAPI URL, and the frontend must point to the correct Express API URL.

---

## API Endpoints

The following are known application route prefixes. The exact HTTP methods, request bodies, authentication requirements, and individual endpoints should be confirmed from the current backend source code.

| Route prefix | Purpose |
|---|---|
| `/api/test` | Backend test or health check |
| `/api/auth` | Registration and login |
| `/api/users` | User-related operations |
| `/api/history` | Conversation history operations, if enabled |
| `/api/ai` | Express proxy for AI service operations |

The AI service exposes FastAPI endpoints defined in `src/api.py`. Visit `/docs` while FastAPI is running to inspect the exact available routes and schemas.

The React application should communicate with the AI service through Express, not by calling FastAPI directly.

---

## Model and Dataset Requirements

This project uses trained machine learning models. Model files and datasets may be large, so they may not be included in the GitHub repository.

Before running inference, check that all files expected by the model-loading code are available.

### Static recognition

The static model recognizes supported alphabetic and numeric hand gestures. Training or retraining may require the static gesture dataset and the scripts provided in the AI service.

### Dynamic recognition

The dynamic model processes a sequence of hand landmarks across video frames. Training or retraining may require the dynamic gesture video dataset and the sequence-processing scripts.

### If model files are missing

1. Check the model paths configured in the relevant `config.py` and prediction service files.
2. Obtain the required model artifacts from the project maintainers, if available.
3. Otherwise, follow the training scripts and dataset instructions to generate the artifacts.
4. Verify that the model and label encoder correspond to the same trained model and class ordering.
5. Restart FastAPI and test the prediction endpoints.

Do not assume that cloning the source code automatically downloads the datasets or trained models.

---

## Troubleshooting

### 1. `npm install` fails

Check the installed Node.js and npm versions:

```bash
node --version
npm --version
```

Read the error message carefully and confirm that you are running `npm install` in the correct directory containing `package.json`.

### 2. MySQL connection fails

Check that:

- MySQL Server is running.
- The database name exists.
- The username and password are correct.
- The configured host and port match your local MySQL setup.
- Required tables have been created.

### 3. FastAPI cannot find a model

Check the expected model paths in the prediction service and configuration files. Confirm that the required model files and label encoders are present.

### 4. FastAPI starts, but prediction fails

Inspect the terminal logs and the API documentation at `/docs`. Check the request format, image or video input requirements, and model-loading messages.

### 5. Express cannot connect to FastAPI

Verify the configured `FASTAPI_URL`. If FastAPI runs on port `8000`, the backend should use the corresponding local URL.

### 6. The browser cannot access the camera

- Confirm that the computer has a working webcam.
- Close applications that may be using the camera.
- Allow camera access in browser permissions and Windows privacy settings.
- Check whether the operating system detects the camera.
- Restart the browser after changing permissions.

If Windows itself reports that no camera is attached, fix the hardware or driver issue before debugging the React application.

### 7. Hindi or Gujarati speech is unavailable

Speech output depends on the browser's speech synthesis support and installed voices. Text translation and speech synthesis are separate capabilities; a translation may display correctly even when a matching voice is unavailable.

### 8. Dynamic gesture files are missing on GitHub

Confirm that the files under `ai-service/isl-gesture-recognition/dynamic-module/src/` are tracked and committed. Check the root and nested `.gitignore` files if Git does not include them.

---

## Security Notes

- Never commit `.env` files, passwords, JWT secrets, or API keys.
- Keep local environment files out of Git using `.gitignore`.
- Use `.env.example` files with placeholder values to document required configuration.
- Do not upload private user data or sensitive datasets.
- Review staged files before every commit.
- If a real API key has been exposed, revoke it and create a replacement.

## Future Improvements

Potential future improvements include:

- Expanding the supported ISL vocabulary.
- Improving recognition under different lighting and camera conditions.
- Enhancing sentence generation beyond the current rule-based approach.
- Supporting additional Indian languages.
- Improving accessibility and user experience.
- Expanding gesture datasets and evaluating recognition on more diverse samples.

## Contributors

This project was developed as a final-year engineering project.

Contributions, suggestions, and bug reports are welcome. Please open an issue or submit a pull request with a clear description of the proposed change.

## License

Add a license appropriate for your project before redistributing or reusing the code. Until a license is added, do not assume that others have permission to reuse the repository's contents beyond the rights granted by applicable law.
