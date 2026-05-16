import { geminiModel } from '@/lib/gemini'
import { supabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, jenis_tanaman, metode_input, pertanyaan } = body

    // Validasi input
    if (!user_id || !jenis_tanaman || !pertanyaan) {
      return NextResponse.json(
        { error: 'user_id, jenis_tanaman, dan pertanyaan wajib diisi' },
        { status: 400 }
      )
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

    const result = await geminiModel.generateContent(prompt)
    const responseText = result.response.text()
    
    // Parse JSON dari Gemini
    const cleanJson = responseText.replace(/```json|```/g, '').trim()
    const hasil_ai = JSON.parse(cleanJson)

    // Simpan ke Supabase
    const { data, error } = await supabaseServer
      .from('konsultasi')
      .insert({
        user_id,
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

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}