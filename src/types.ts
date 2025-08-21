
export interface StudentAnswer {
  questionNumber: number;
  unmarkedOptions: string; // e.g., "A C D"
}

export interface StudentInfo {
    nom: string;
    matricule: string;
    session: string;
    epreuve: string;
    type: string;
    classe: string;
    codeExamen: string;
}

export interface ExtractedData {
    studentInfo: StudentInfo;
    answers: StudentAnswer[];
}

export type Corrections = Record<number, string>;
