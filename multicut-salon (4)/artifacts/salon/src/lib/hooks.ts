import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { SalonSettings, defaultSettings } from "./types";

export function useSalonSettings() {
  const [settings, setSettings] = useState<SalonSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("settings").select("*").single().then(({ data }) => {
      if (data) setSettings({ ...defaultSettings, ...data });
      setLoading(false);
    });
  }, []);
  return { settings, loading };
}

export async function uploadImage(bucket: string, file: File, folder = ""): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}
