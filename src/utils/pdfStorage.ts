import { UploadedSubjectPDF } from "../types";

const LOCAL_STORAGE_KEY = "aura_academic_uploaded_subject_pdfs_v1";

const SEED_PDFS: UploadedSubjectPDF[] = [
  {
    id: "seed-math-1",
    subjectId: "maths",
    subjectName: "Mathematics",
    fileName: "NCERT_Class7_Mathematics_GanitaPrakash_Ch1_Integers.pdf",
    fileSize: "2.4 MB",
    uploadDate: "Aug 12, 2026, 10:00 AM",
    category: "Textbook",
    description: "Official 7th Standard NCERT Mathematics (Ganita Prakash) Chapter 1: Integers & Properties of Operations with worked examples.",
    previewText: `NCERT CLASS 7 MATHEMATICS - GANITA PRAKASH (गणित प्रकाश)
CHAPTER 1: INTEGERS & OPERATIONAL PROPERTIES

1. Integers on the Number Line:
- An integer is any whole number (positive, negative, or zero).
- Addition rules: (-a) + (-b) = -(a + b)
- Multiplication rules: (-a) * (-b) = +(a * b)

2. Properties of Integers:
- Closure Property: For any integers a and b, a + b and a * b are integers.
- Commutative Property: a + b = b + a and a * b = b * a.
- Associative Property: (a + b) + c = a + (b + c).
- Distributive Property: a * (b + c) = (a * b) + (a * c). Example: 15 * (10 + 2) = 15*10 + 15*2 = 180.

3. Practice Worked Problems:
- Solve 4(m + 3) = 18.
- Step 1: Divide both sides by 4 => m + 3 = 4.5
- Step 2: Subtract 3 => m = 1.5`,
  },
  {
    id: "seed-math-2",
    subjectId: "maths",
    subjectName: "Mathematics",
    fileName: "Class7_Maths_Algebra_and_Geometry_Formula_Sheet.pdf",
    fileSize: "1.8 MB",
    uploadDate: "Aug 12, 2026, 11:30 AM",
    category: "Notes",
    description: "Comprehensive Mathematics Formula Sheet covering Fractions, Linear Equations, Triangles, and Mensuration Formulas.",
    previewText: `7TH STANDARD MATHEMATICS FORMULA SHEET & QUICK REVISION

A. FRACTIONS & DECIMALS:
- Division of Fractions: (a/b) ÷ (c/d) = (a/b) * (d/c)
- Decimal Multiplication: 2.5 * 1.25 = 3.125

B. LINES & ANGLES:
- Complementary Angles: Sum equals 90°
- Supplementary Angles: Sum equals 180°
- Parallel Lines (l || m): Alternate interior angles are equal; corresponding angles are equal.

C. TRIANGLES & MENSURATION:
- Area of Triangle = 1/2 * base * height
- Perimeter of Rectangle = 2 * (length + width)
- Area of Circle = π * r²`,
  },
  {
    id: "seed-hindi-1",
    subjectId: "hindi",
    subjectName: "Hindi",
    fileName: "NCERT_Class7_Hindi_Malhar_Path_1_Aur_Vyakaran.pdf",
    fileSize: "2.1 MB",
    uploadDate: "Aug 12, 2026, 09:15 AM",
    category: "Textbook",
    description: "NCERT Class 7 Hindi Malhar Series: Path 1 Kahani, Vyakaran, Sandhi & Muhavare Notes PDF.",
    previewText: `एनसीईआरटी कक्षा 7 हिंदी (मल्हार श्रृंखला) - पाठ 1 एवं व्याकरण अध्ययन पत्र

१. भाषा और व्याकरण नियम:
- संधि: दो वर्णों के मेल से होने वाले विकार को संधि कहते हैं।
- समास: दो या दो से अधिक शब्दों के योग से बना नया शब्द समास कहलाता है।

२. महत्वपूर्ण मुहावरे और लोकोक्तियाँ:
- 'अंगूठा दिखाना' - साफ़ मना कर देना।
- 'ईंट से ईंट बजाना' - कड़ा मुकाबला करना।

३. पत्र लेखन का प्रारूप:
- औपचारिक पत्र (प्रधानाचार्य को प्रार्थना पत्र): सेवा में, श्रीमान प्रधानाचार्य महोदय...`,
  },
];

// Get all uploaded PDFs from localStorage (with SEED_PDFS fallback)
export const getUploadedPDFs = (): UploadedSubjectPDF[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_PDFS));
      return SEED_PDFS;
    }
    const parsed = JSON.parse(data) as UploadedSubjectPDF[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_PDFS));
      return SEED_PDFS;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading uploaded PDFs from localStorage:", err);
    return SEED_PDFS;
  }
};

// Get uploaded PDFs for a specific subject
export const getUploadedPDFsForSubject = (subjectId: string): UploadedSubjectPDF[] => {
  const allPDFs = getUploadedPDFs();
  return allPDFs.filter((pdf) => pdf.subjectId.toLowerCase() === subjectId.toLowerCase());
};

// Save a new uploaded PDF
export const saveUploadedPDF = (pdf: UploadedSubjectPDF): UploadedSubjectPDF[] => {
  const allPDFs = getUploadedPDFs();
  const updated = [pdf, ...allPDFs];
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error saving uploaded PDF to localStorage:", err);
  }
  return updated;
};

// Delete an uploaded PDF by ID
export const deleteUploadedPDF = (pdfId: string): UploadedSubjectPDF[] => {
  const allPDFs = getUploadedPDFs();
  const updated = allPDFs.filter((pdf) => pdf.id !== pdfId);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error deleting uploaded PDF from localStorage:", err);
  }
  return updated;
};

// Helper to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
