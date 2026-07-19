import fs from "fs";
import path from "path";
import { google } from "googleapis";

// const FOLDER_ID = "1-JJjtEwOJ_FG80LYmZitw3cvFPE6Tvbn";
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!;

const CONTENT_DIR = path.join(
  process.cwd(),
  "content",
  "problems"
);

let credentials;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  credentials = JSON.parse(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  );
} else {
  credentials = JSON.parse(
    fs.readFileSync("secrets/service-account.json", "utf8")
  );
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({
  version: "v3",
  auth,
});

async function syncDrive() {

  console.log("Syncing Google Drive...");

  // Remove old files
  fs.rmSync(CONTENT_DIR, {
    recursive: true,
    force: true,
  });

  fs.mkdirSync(CONTENT_DIR, {
    recursive: true,
  });

  const res = await drive.files.list({
    q: `'${FOLDER_ID}' in parents and trashed=false`,
    fields: "files(id,name)",
    pageSize: 1000,
  });

  const files = res.data.files ?? [];

  for (const file of files) {

    if (!file.name?.endsWith(".mdx")) continue;

    console.log(`Downloading ${file.name}`);

    const response = await drive.files.get(
      {
        fileId: file.id!,
        alt: "media",
      },
      {
        responseType: "stream",
      }
    );

    const output = fs.createWriteStream(
      path.join(CONTENT_DIR, file.name)
    );

    await new Promise<void>((resolve, reject) => {
      response.data
        .pipe(output)
        .on("finish", resolve)
        .on("error", reject);
    });
  }

  console.log("Drive sync completed.");
}

syncDrive().catch((err) => {
  console.error(err);
  process.exit(1);
});