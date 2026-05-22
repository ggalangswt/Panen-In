import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Mengatasi masalah format newline pada private key di beberapa OS
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
    console.log('✅ Firebase Admin SDK berhasil diinisialisasi')
  } catch (error) {
    console.error('❌ Gagal inisialisasi Firebase Admin SDK:', error)
  }
}

export const messaging = admin.messaging()