
Answer Sheet AI Assistant

An AI-powered tool to automatically extract student details and process multiple-choice answers from scanned answer sheets.
Just upload an image, let the AI do the work, fix any mistakes, and download the results as a clean JSON file — all in a modern, responsive interface.

Features

* AI OCR powered by Google Gemini for accurate text and image recognition
* Automatically extracts student information (Name, ID, Session, etc.)
* Detects unmarked options for up to 40 questions
* Modern, responsive interface with gradient backgrounds
* Works on desktop, tablet, and mobile
* Exports results as JSON with the student’s name in the filename

Requirements

* Node.js version 16 or later with npm
* Download from nodejs.org (choose LTS version)

Installation and Setup

1. Extract the project folder to your desired location.
   Windows example: C:\Users\YourName\Desktop\answer-sheet-ai-assistant
   Mac example: /Users/YourName/Desktop/answer-sheet-ai-assistant

2. Get your Google Gemini API key:

   * Visit Google AI Studio: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
   * Create a new API key or use an existing one
   * Copy the key for the next step

3. Create a .env file in the project folder:
   Content should be:
   VITE\_API\_KEY=YOUR\_API\_KEY\_HERE
   Notes: No spaces around =, no quotes around the key, replace with your actual key

   Windows CMD example:
   cd C:\Users\YourName\Desktop\answer-sheet-ai-assistant
   echo VITE\_API\_KEY=YOUR\_API\_KEY\_HERE > .env

   Mac Terminal example:
   cd /Users/YourName/Desktop/answer-sheet-ai-assistant
   echo "VITE\_API\_KEY=YOUR\_API\_KEY\_HERE" > .env

4. Install dependencies:
   cd /path/to/answer-sheet-ai-assistant
   npm install

Running the Application

* Start the development server:
  npm run dev
* Open the link shown in the terminal (example: [http://localhost:5173/](http://localhost:5173/))

How to Use

1. Upload an answer sheet (PNG, JPG, WEBP; clear high-quality images recommended)
2. Click "Process Answer Sheet" and wait for AI analysis (10–30 seconds)
3. Review extracted details (student info and unmarked options for each question)
4. Make corrections if needed using the pencil icon
5. Download the results as JSON (file name includes student name and ID)

Troubleshooting

* API Key Error: Check .env file format, key starts with AIza, restart server
* Quota Exceeded: Check Google AI Studio usage limits
* White Screen: Check browser console, clear cache
* Module Not Found: Run npm install or delete node\_modules and reinstall

System Requirements

* Node.js 16 or newer
* Chrome, Firefox, Safari, or Edge (latest versions)
* Internet connection required for AI processing
* 4GB+ RAM (8GB recommended)

Output JSON Example

{
"student": "Student Name",
"studentInfo": {
"nom": "Full Name",
"matricule": "Student ID",
"session": "Exam Session",
"epreuve": "Subject",
"type": "Exam Type",
"classe": "Class",
"codeExamen": "Exam Code"
},
"answers": \[
{
"questionNumber": 1,
"unmarkedOptions": "A C D"
}
]
}
