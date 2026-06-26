import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App & Auth
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Google OAuth provider with necessary scopes for Google Drive
const provider = new GoogleAuthProvider();

// Add Drive Scopes requested by user
const DRIVE_SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.readonly"
];

DRIVE_SCOPES.forEach(scope => provider.addScope(scope));

// In-memory token storage
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token has expired or needs refreshing; client can call login
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign-in method
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Google Drive access token is required but was not found.");
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Firebase Sign In with Google failed:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Sign-out method
export const googleSignOut = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// Drive File Interface
export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
  modifiedTime?: string;
  thumbnailLink?: string;
}

// 1. List files in Google Drive (specifically looking for PDFs, sheets, docs, text, etc.)
export const listDriveFiles = async (token: string, q?: string): Promise<GoogleDriveFile[]> => {
  const queryParts = [
    "trashed = false",
    "mimeType != 'application/vnd.google-apps.folder'" // only files
  ];

  if (q) {
    queryParts.push(`name contains '${q.replace(/'/g, "\\'")}'`);
  }

  const queryParam = encodeURIComponent(queryParts.join(" and "));
  const url = `https://www.googleapis.com/drive/v3/files?q=${queryParam}&fields=files(id,name,mimeType,size,webViewLink,modifiedTime,thumbnailLink)&orderBy=modifiedTime desc&pageSize=50`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Drive API error listing files: ${errText}`);
  }

  const data = await response.json();
  return data.files || [];
};

// 2. Upload a simple file (text/json/csv) or document to Google Drive
export const uploadFileToDrive = async (
  token: string,
  fileName: string,
  content: string,
  mimeType: string = "text/plain"
): Promise<GoogleDriveFile> => {
  const metadata = {
    name: fileName,
    mimeType: mimeType
  };

  const boundary = "benepeople_erp_boundary";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const body =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}; charset=UTF-8\r\n\r\n` +
    content +
    closeDelimiter;

  const url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,modifiedTime";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/related; boundary=${boundary}`
    },
    body: body
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Drive API error uploading file: ${errText}`);
  }

  return await response.json();
};

// 3. Delete a file on Google Drive (Requires explicit confirmation inside UI before calling)
export const deleteDriveFile = async (token: string, fileId: string): Promise<void> => {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Drive API error deleting file: ${errText}`);
  }
};
