import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name);
  private app: admin.app.App | null = null;

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      if (admin.apps.length > 0) {
        this.app = admin.apps[0];
        return;
      }

      // Check standard service account locations
      const possiblePaths = [
        process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
        path.resolve(process.cwd(), 'sda-matrimony-prod-firebase-adminsdk-fbsvc-171b25afe2.json'),
        path.resolve(process.cwd(), '../../sda-matrimony-prod-firebase-adminsdk-fbsvc-171b25afe2.json'),
        path.resolve(__dirname, '../../../../sda-matrimony-prod-firebase-adminsdk-fbsvc-171b25afe2.json'),
      ].filter(Boolean) as string[];

      let credential: admin.credential.Credential | null = null;

      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          this.logger.log(`Found Firebase Admin credentials at: ${p}`);
          const serviceAccount = JSON.parse(fs.readFileSync(p, 'utf8'));
          credential = admin.credential.cert(serviceAccount);
          break;
        }
      }

      if (!credential) {
        this.logger.warn('Firebase service account key not found. Firebase Admin features will be inactive.');
        return;
      }

      this.app = admin.initializeApp({
        credential,
        projectId: 'sda-matrimony-prod',
        storageBucket: 'sda-matrimony-prod.firebasestorage.app',
      });

      this.logger.log('Firebase Admin SDK initialized successfully for project: sda-matrimony-prod');
    } catch (error) {
      this.logger.error('Error initializing Firebase Admin SDK', error);
    }
  }

  getAuth(): admin.auth.Auth | null {
    return this.app ? admin.auth(this.app) : null;
  }

  getFirestore(): admin.firestore.Firestore | null {
    return this.app ? admin.firestore(this.app) : null;
  }

  getMessaging(): admin.messaging.Messaging | null {
    return this.app ? admin.messaging(this.app) : null;
  }

  getStorage(): admin.storage.Storage | null {
    return this.app ? admin.storage(this.app) : null;
  }
}
