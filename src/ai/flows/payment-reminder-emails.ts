'use server';

/**
 * @fileOverview Genkit flow for generating personalized payment reminder email drafts.
 *
 * - generatePaymentReminderEmail - A function that generates a payment reminder email draft.
 * - GeneratePaymentReminderEmailInput - The input type for the generatePaymentReminderEmail function.
 * - GeneratePaymentReminderEmailOutput - The return type for the generatePaymentReminderEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePaymentReminderEmailInputSchema = z.object({
  customerName: z.string().describe('The name of the customer.'),
  amountDue: z.number().describe('The amount due for the payment.'),
  dueDate: z.string().describe('The due date for the payment (e.g., YYYY-MM-DD).'),
  brandingElements: z.string().optional().describe('The branding elements (logos, colors) to incorporate into the email.'),
});
export type GeneratePaymentReminderEmailInput = z.infer<typeof GeneratePaymentReminderEmailInputSchema>;

const GeneratePaymentReminderEmailOutputSchema = z.object({
  emailDraft: z.string().describe('The generated payment reminder email draft.'),
});
export type GeneratePaymentReminderEmailOutput = z.infer<typeof GeneratePaymentReminderEmailOutputSchema>;

export async function generatePaymentReminderEmail(input: GeneratePaymentReminderEmailInput): Promise<GeneratePaymentReminderEmailOutput> {
  return generatePaymentReminderEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePaymentReminderEmailPrompt',
  input: {schema: GeneratePaymentReminderEmailInputSchema},
  output: {schema: GeneratePaymentReminderEmailOutputSchema},
  prompt: `You are an AI assistant specialized in drafting personalized payment reminder emails.

  Based on the provided customer information and branding elements, create a professional and friendly payment reminder email draft.
  Incorporate the branding elements if provided, and ensure the email clearly states the amount due and the due date.

  Customer Name: {{{customerName}}}
  Amount Due: {{{amountDue}}}
  Due Date: {{{dueDate}}}
  Branding Elements: {{{brandingElements}}}

  Draft the payment reminder email:
`,
});

const generatePaymentReminderEmailFlow = ai.defineFlow(
  {
    name: 'generatePaymentReminderEmailFlow',
    inputSchema: GeneratePaymentReminderEmailInputSchema,
    outputSchema: GeneratePaymentReminderEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
