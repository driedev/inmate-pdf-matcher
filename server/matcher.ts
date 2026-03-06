import Fuse from 'fuse.js';
import { Inmate, MatchResult } from '@shared/schema';

// Use require for pdf-parse to avoid ESM default export issues
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text;
}

export function extractNamesFromText(text: string): string[] {
  // A simplistic regex to find potential names (e.g. Lastname, Firstname or Firstname Lastname)
  // This would need refinement based on actual document formats
  const names: string[] = [];
  
  // Example regex looking for capitalized words that might be names
  const potentialNamesMatch = text.match(/[A-Z][a-z]+,?\s+[A-Z][a-z]+/g);
  
  if (potentialNamesMatch) {
    for (const name of potentialNamesMatch) {
      // Normalize name
      const normalized = name.replace(/,/g, '').trim().toUpperCase();
      if (normalized && !names.includes(normalized)) {
        names.push(normalized);
      }
    }
  }
  
  return names;
}

export function matchNames(pdfNames: string[], inmates: Inmate[]): MatchResult[] {
  const results: MatchResult[] = [];
  
  const options = {
    includeScore: true,
    keys: ['fullName'],
    threshold: 0.3, // Lower threshold in Fuse.js means closer match.
  };
  
  const fuse = new Fuse(inmates, options);
  
  for (const pdfName of pdfNames) {
    const searchResults = fuse.search(pdfName);
    
    if (searchResults.length > 0) {
      // Fuse score: 0 is exact, 1 is mismatch. We want confidence where 1 is exact.
      // So confidence = 1 - score
      const bestMatch = searchResults[0];
      const confidence = 1 - (bestMatch.score || 0);
      
      if (confidence >= 0.7) {
         results.push({
           pdfName,
           matchedName: bestMatch.item.fullName,
           confidence,
           isMatch: true,
           inmateDetails: bestMatch.item
         });
      } else {
        results.push({
          pdfName,
          isMatch: false
        });
      }
    } else {
      results.push({
        pdfName,
        isMatch: false
      });
    }
  }
  
  return results;
}
