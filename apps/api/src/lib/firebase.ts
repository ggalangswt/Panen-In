import * as admin from 'firebase-admin'
import {
  getFirebaseClientEmail,
  getFirebasePrivateKey,
  getFirebaseProjectId,
} from '@/lib/env'

function getFirebaseApp() {
  if (admin.apps.length) {
    return admin.app()
  }

  const projectId = getFirebaseProjectId()
  const clientEmail = getFirebaseClientEmail()
  const privateKey = getFirebasePrivateKey().replace(/\\n/g, '\n')

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })
}

export function getMessaging() {
  return getFirebaseApp().messaging()
}
