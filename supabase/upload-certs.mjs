/**
 * Script to upload certificate PDFs to Supabase Storage
 * 
 * Usage:
 * 1. Make sure your .env file has SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * 2. Run: node supabase/upload-certs.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'certificates';
const LOCAL_CERTS_PATH = './public/img';

// Map of original filenames to sanitized storage names
const filePathMap = new Map();

function sanitizeFileName(filename) {
  // Replace problematic characters with safe alternatives
  return filename
    .replace(/\|/g, '-')           // pipe to dash
    .replace(/:/g, '-')            // colon to dash
    .replace(/\?/g, '')            // remove question marks
    .replace(/"/g, '')             // remove quotes
    .replace(/</g, '')             // remove less than
    .replace(/>/g, '')             // remove greater than
    .replace(/\*/g, '')            // remove asterisks
    .replace(/–/g, '-')            // en-dash to hyphen
    .replace(/—/g, '-')            // em-dash to hyphen
    .replace(/'/g, '')             // curly apostrophe
    .replace(/'/g, '')             // curly apostrophe
    .replace(/\s+/g, '_')          // spaces to underscores
    .replace(/_+/g, '_')           // collapse multiple underscores
    .replace(/^_|_$/g, '');        // trim leading/trailing underscores
}

async function ensureBucketExists() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === BUCKET_NAME);
  
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10485760 // 10MB
    });
    if (error) {
      console.error('Error creating bucket:', error.message);
      process.exit(1);
    }
    console.log(`Created bucket: ${BUCKET_NAME}`);
  } else {
    console.log(`Bucket ${BUCKET_NAME} already exists`);
  }
}

async function uploadFile(localPath, storagePath) {
  const fileBuffer = readFileSync(localPath);
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });
  
  if (error) {
    console.error(`Error uploading ${storagePath}:`, error.message);
    return false;
  }
  
  console.log(`Uploaded: ${storagePath}`);
  return true;
}

async function uploadDirectory(localDir, storagePrefix = '') {
  const items = readdirSync(localDir);
  
  for (const item of items) {
    const localPath = join(localDir, item);
    const stat = statSync(localPath);
    
    if (stat.isDirectory()) {
      // Recursively upload subdirectories
      await uploadDirectory(localPath, storagePrefix ? `${storagePrefix}/${item}` : item);
    } else if (item.endsWith('.pdf')) {
      const sanitizedName = sanitizeFileName(item);
      const originalPath = storagePrefix ? `${storagePrefix}/${item}` : item;
      const storagePath = storagePrefix ? `${storagePrefix}/${sanitizedName}` : sanitizedName;
      
      // Track the mapping for database update
      filePathMap.set(originalPath, storagePath);
      
      await uploadFile(localPath, storagePath);
    }
  }
}

async function updateDatabasePaths() {
  // Get all certificates
  const { data: certs, error } = await supabase
    .from('certificates')
    .select('id, pdf_path');
  
  if (error) {
    console.error('Error fetching certificates:', error.message);
    return;
  }
  
  for (const cert of certs) {
    if (!cert.pdf_path) continue;
    
    // Convert local path (img/filename.pdf) to storage path
    const originalPath = cert.pdf_path.replace(/^img\//, '');
    
    // Check if we have a sanitized version, otherwise sanitize it
    let newPath = filePathMap.get(originalPath);
    if (!newPath) {
      // Sanitize the path parts
      const parts = originalPath.split('/');
      newPath = parts.map(p => p.endsWith('.pdf') ? sanitizeFileName(p) : p).join('/');
    }
    
    const { error: updateError } = await supabase
      .from('certificates')
      .update({ pdf_path: newPath })
      .eq('id', cert.id);
    
    if (updateError) {
      console.error(`Error updating ${cert.pdf_path}:`, updateError.message);
    } else {
      console.log(`Updated path: ${cert.pdf_path} -> ${newPath}`);
    }
  }
}

async function main() {
  console.log('Starting certificate migration to Supabase Storage...\n');
  
  // Step 1: Ensure bucket exists
  console.log('Step 1: Checking/creating storage bucket...');
  await ensureBucketExists();
  
  // Step 2: Upload all PDFs
  console.log('\nStep 2: Uploading PDF files...');
  await uploadDirectory(LOCAL_CERTS_PATH);
  
  // Step 3: Update database paths
  console.log('\nStep 3: Updating database paths...');
  await updateDatabasePaths();
  
  console.log('\nMigration complete!');
  console.log(`\nYour certificates are now available at:`);
  console.log(`${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/[filename]`);
}

main().catch(console.error);
