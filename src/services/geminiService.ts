import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { ExtractedData, Corrections } from '../types';

const apiKey = import.meta.env.VITE_API_KEY;
if (!apiKey) {
  throw new Error("VITE_API_KEY is not defined in .env file");
}

console.log('🔑 API Key loaded:', apiKey ? 'Yes' : 'No');
console.log('🔑 API Key format:', apiKey ? `${apiKey.substring(0, 10)}...` : 'None');

// Validate API key format
if (apiKey && !apiKey.startsWith('AIza')) {
  console.warn('⚠️  API key might be in wrong format. Gemini keys usually start with "AIza"');
}

const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        studentInfo: {
            type: Type.OBJECT,
            properties: {
                nom: { type: Type.STRING, description: "Student's full name (Nom). If blank, return an empty string." },
                matricule: { type: Type.STRING, description: "Student's ID (Matricule). If blank, return an empty string." },
                session: { type: Type.STRING, description: "Exam session (e.g., Juin 2025). If blank, return an empty string." },
                epreuve: { type: Type.STRING, description: "Subject of the exam (Epreuve). If blank, return an empty string." },
                type: { type: Type.STRING, description: "Type of the exam. If blank, return an empty string." },
                classe: { type: Type.STRING, description: "Student's class (Classe). If blank, return an empty string." },
                codeExamen: { type: Type.STRING, description: "Exam code (Code examen). If blank, return an empty string." },
            },
            required: ["nom", "matricule", "session", "epreuve", "type", "classe", "codeExamen"],
        },
        answers: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    questionNumber: { type: Type.INTEGER, description: "The question number." },
                    unmarkedOptions: { type: Type.STRING, description: "A space-separated string of the options (A, B, C, D) that were NOT marked. If none were marked, this should be 'A B C D'." },
                },
                required: ["questionNumber", "unmarkedOptions"],
            },
        },
    },
    required: ["studentInfo", "answers"],
};

export const extractSheetData = async (base64Image: string, corrections: Corrections = {}): Promise<ExtractedData> => {
  console.log('📷 Processing image, size:', base64Image.length);
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image.split(',')[1], // remove the data:image/jpeg;base64, part
    },
  };

  let correctionPrompt = "";
  if (Object.keys(corrections).length > 0) {
    correctionPrompt = "\n\n**Correction Feedback:**\nYou previously made some errors. Please use the following corrections to improve your analysis of the entire sheet. This is crucial for accuracy.\n";
    for (const [qNum, unmarked] of Object.entries(corrections)) {
        correctionPrompt += `- For Question ${qNum}, the correct unmarked options are "${unmarked}".\n`;
    }
    correctionPrompt += "Re-analyze the entire image with this new information.";
  }

  const textPart = {
    text: `You are an expert OCR assistant specialized in processing multiple-choice question (MCQ) answer sheets from an image.
** Marked Option : The marked option is typically scribbled over in such a way that the option is not visible or barely visible.**
Your task is to extract two types of information:
1.  **Student Information**: From the header, extract all personal details (Nom, Matricule, Session, etc.). If a field is blank, return an empty string.
2.  **Unmarked Options**: For each question, identify which of the four options (A, B, C, D) are **NOT** marked. 

Your response MUST be a single JSON object that follows the provided schema.

**Instructions for Unmarked Options:**
- If one option is marked (e.g., B), list the other three (e.g., "A C D").
- If multiple options are marked (e.g., B and C), list the remaining ones (e.g., "A D").
- If no options are marked for a question, list all four options ("A B C D").
- The output for unmarked options should be a single string with letters separated by spaces.
- this is to mark real students so be careful with the output
- analyze all 40 questions present in the sheet
${correctionPrompt}
`,
  };

  try {
    console.log('🤖 Calling Gemini API...');
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] }
    });

    console.log('✅ Received response from Gemini');
    
    let jsonText = response.text;
    console.log('📄 Raw response:', jsonText);
    
    // Clean the response if it's wrapped in markdown code blocks
    if (jsonText.includes('```json')) {
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.replace(/```\s*/g, '');
    }
    
    const parsedJson = JSON.parse(jsonText.trim());
    console.log('🔍 Parsed JSON structure:', Object.keys(parsedJson));
    
    // Transform the response to match our expected format
    let transformedData: ExtractedData;
    
    if (parsedJson.student_information && parsedJson.unmarked_options) {
      // Convert from Gemini's format to our format
      const answers = [];
      for (const [questionKey, unmarkedOptions] of Object.entries(parsedJson.unmarked_options)) {
        const questionNumber = parseInt(questionKey.replace('Question ', ''));
        answers.push({
          questionNumber,
          unmarkedOptions: unmarkedOptions as string
        });
      }
      
      transformedData = {
        studentInfo: {
          nom: parsedJson.student_information.Nom || '',
          matricule: parsedJson.student_information.Matricule || '',
          session: parsedJson.student_information.Session || '',
          epreuve: parsedJson.student_information.Epreuve || '',
          type: parsedJson.student_information.Type || '',
          classe: parsedJson.student_information.Classe || '',
          codeExamen: parsedJson.student_information['Code Examen'] || ''
        },
        answers
      };
    } else if (parsedJson.studentInfo && parsedJson.answers) {
      // Already in correct format
      transformedData = parsedJson;
    } else {
      console.error('❌ Unexpected response format:', parsedJson);
      throw new Error("AI response is not in the expected format.");
    }

    console.log('🎉 Successfully transformed response:', transformedData);
    return transformedData;

  } catch (error) {
    console.error("❌ Error calling Gemini API:", error);
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API_KEY') || error.message.includes('401')) {
        throw new Error("Invalid API key. Please check your VITE_API_KEY in the .env file.");
      }
      if (error.message.includes('quota') || error.message.includes('429')) {
        throw new Error("API quota exceeded. Please check your Gemini API usage limits.");
      }
      if (error.message.includes('permission') || error.message.includes('403')) {
        throw new Error("API permission denied. Please verify your API key has the correct permissions.");
      }
      if (error.message.includes('model')) {
        throw new Error("Model not found. Please check if you have access to Gemini 1.5 Flash.");
      }
    }
    
    throw new Error(`Failed to analyze the answer sheet: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};