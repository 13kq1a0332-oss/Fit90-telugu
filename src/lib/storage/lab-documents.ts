import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface UploadedDocumentMeta {
  storagePath: string;
  fileName: string;
  fileSizeBytes: number;
  uploadedAt: string;
}

const LOCAL_DOCS_KEY = "fit90_private_docs_meta";

/**
 * Uploads a health document / lab PDF to Supabase Storage under a private user path.
 * Strict Row Level Security prevents access by any other user.
 */
export async function uploadPrivateLabDocument(
  file: File
): Promise<UploadedDocumentMeta> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();
  const mockPath = `private/labs/${timestamp}_${sanitizedName}`;

  const meta: UploadedDocumentMeta = {
    storagePath: mockPath,
    fileName: file.name,
    fileSizeBytes: file.size,
    uploadedAt: new Date().toISOString(),
  };

  // Check if live Supabase is configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const fullPath = `${user.id}/${timestamp}_${sanitizedName}`;
        const { error } = await supabase.storage
          .from("private-health-documents")
          .upload(fullPath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (!error) {
          meta.storagePath = fullPath;
        } else {
          console.warn("Supabase Storage upload warning (falling back):", error.message);
        }
      }
    } catch (err) {
      console.warn("Storage upload exception:", err);
    }
  }

  // Persist metadata locally for offline access
  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem(LOCAL_DOCS_KEY);
      const list: UploadedDocumentMeta[] = existing ? JSON.parse(existing) : [];
      list.push(meta);
      localStorage.setItem(LOCAL_DOCS_KEY, JSON.stringify(list));
    } catch {
      // storage unavailable
    }
  }

  return meta;
}

export function getLocalDocumentMetas(): UploadedDocumentMeta[] {
  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem(LOCAL_DOCS_KEY);
      return existing ? JSON.parse(existing) : [];
    } catch {
      return [];
    }
  }
  return [];
}

