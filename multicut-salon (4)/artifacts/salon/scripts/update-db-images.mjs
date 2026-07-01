import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");

// Load .env.local manually to avoid external dependencies
let supabaseUrl = "";
let supabaseAnonKey = "";

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*(.+)/);
  const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.+)/);
  if (urlMatch) supabaseUrl = urlMatch[1].trim();
  if (keyMatch) supabaseAnonKey = keyMatch[1].trim();
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const email = process.argv[2];
const password = process.argv[3];

async function run() {
  if (email && password) {
    console.log(`Attempting login for ${email}...`);
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      console.error("Login failed:", loginError.message);
      process.exit(1);
    }
    console.log("Logged in successfully!");
  } else {
    console.log("No credentials provided. Attempting updates anonymously (may fail if RLS is enabled)...");
  }

  // 1. Update Face Care services
  console.log("Updating Face Care images...");
  const { error: errFace } = await supabase
    .from("services")
    .update({ image_url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80" })
    .eq("category", "Face Care")
    .eq("image_url", "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80");

  if (errFace) {
    handleError("Face Care update failed", errFace);
  } else {
    console.log("✓ Face Care images updated successfully!");
  }

  // 2. Update Hair Colour services
  console.log("Updating Hair Colour images...");
  const { error: errColour } = await supabase
    .from("services")
    .update({ image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80" })
    .eq("category", "Hair Colour")
    .eq("image_url", "https://images.unsplash.com/photo-1598524997937-b9c4bc2fa0dd?w=600&q=80");

  if (errColour) {
    handleError("Hair Colour update failed", errColour);
  } else {
    console.log("✓ Hair Colour images updated successfully!");
  }

  // 3. Update Hair Wash services
  console.log("Updating Hair Wash images...");
  const { error: errWash } = await supabase
    .from("services")
    .update({ image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80" })
    .eq("category", "Hair Wash & Head Massage")
    .eq("image_url", "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80");

  if (errWash) {
    handleError("Hair Wash update failed", errWash);
  } else {
    console.log("✓ Hair Wash images updated successfully!");
  }

  // 4. Update Gallery blowout image
  console.log("Updating Gallery blowout image...");
  const { error: errGallery } = await supabase
    .from("gallery")
    .update({ image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80" })
    .eq("caption", "Blowout perfection")
    .eq("image_url", "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80");

  if (errGallery) {
    handleError("Gallery update failed", errGallery);
  } else {
    console.log("✓ Gallery blowout image updated successfully!");
  }

  console.log("\nAll update attempts completed!");
}

function handleError(title, error) {
  console.error(`✗ ${title}:`, error.message);
  if (error.message.includes("violates row-level security") || error.status === 401 || error.status === 403) {
    console.warn("\n[Warning] This action requires admin permissions.");
    console.warn("Please run the script with admin credentials:");
    console.warn("  node scripts/update-db-images.mjs <admin-email> <admin-password>");
    console.warn("\nAlternatively, you can run the SQL queries in your Supabase SQL Editor using src/lib/services-seed.sql.");
  }
}

run().catch(console.error);
