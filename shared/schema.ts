import { z } from "zod";

export const inmateSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  photoUrl: z.string().optional(),
  bookingId: z.string().optional(),
  source: z.string(),
});

export type Inmate = z.infer<typeof inmateSchema>;

export const matchResultSchema = z.object({
  pdfName: z.string(),
  matchedName: z.string().optional(),
  confidence: z.number().optional(),
  isMatch: z.boolean(),
  inmateDetails: inmateSchema.optional(),
});

export type MatchResult = z.infer<typeof matchResultSchema>;

export const processResponseSchema = z.object({
  documentType: z.string(),
  typeConfidence: z.number(),
  needsReview: z.boolean(),
  extractedText: z.string(),
  matches: z.array(matchResultSchema),
});

export type ProcessResponse = z.infer<typeof processResponseSchema>;
