import { GoogleGenerativeAI } from '@google/generative-ai'

import { getGeminiApiKey } from '@/lib/env'

let geminiModel: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null

export function getGeminiModel() {
  if (!geminiModel) {
    const genAI = new GoogleGenerativeAI(getGeminiApiKey())
    geminiModel = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `Kamu adalah asisten pertanian untuk petani Indonesia. 
  Jawab selalu dalam bahasa Indonesia yang sederhana dan mudah dipahami petani.
  Hindari istilah teknis agronomi yang sulit.
  Setiap jawaban harus actionable dan praktis.
  Format jawaban selalu dalam 3 bagian:
  1. Kemungkinan Penyebab (maksimal 3 poin)
  2. Rekomendasi Tindakan (maksimal 3 poin)
  3. Tips Pencegahan (maksimal 3 poin)`,
    })
  }

  return geminiModel
}
