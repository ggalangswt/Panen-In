import { requireAuthenticatedUser } from '@/lib/auth'
import { getGeminiModel } from '@/lib/gemini'
import { badRequest, handleRouteError } from '@/lib/http'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const body = await request.json()
    const { jenis_tanaman, metode_input, pertanyaan } = body

    // Validasi input
    if (!jenis_tanaman || !pertanyaan) {
      return badRequest('jenis_tanaman dan pertanyaan wajib diisi')
    }

    // Kirim ke Gemini
    const prompt = `
      Tanaman: ${jenis_tanaman}
      Pertanyaan petani: ${pertanyaan}
      
      Berikan jawaban dalam format JSON seperti ini:
      {
        "penyebab": ["poin 1", "poin 2", "poin 3"],
        "rekomendasi": ["poin 1", "poin 2", "poin 3"],
        "pencegahan": ["poin 1", "poin 2", "poin 3"]
      }
      
      Jawab hanya dengan JSON, tanpa teks tambahan.
    `

    const result = await getGeminiModel().generateContent(prompt)
    const responseText = result.response.text()
    
    // Parse JSON dari Gemini
    const cleanJson = responseText.replace(/```json|```/g, '').trim()
    const hasil_ai = JSON.parse(cleanJson)

    // Simpan ke Supabase
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('konsultasi')
      .insert({
        user_id: user.id,
        jenis_tanaman,
        metode_input: metode_input || 'teks',
        pertanyaan,
        hasil_ai
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      status: 'success', 
      data 
    })

  } catch (error) {
    return handleRouteError(error)
  }
}
