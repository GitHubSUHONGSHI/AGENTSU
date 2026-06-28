import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const coursePath = "src/data/python-course.json";
const publicRoot = "public";
const docxPath =
  process.env.COURSE_DOCX ??
  "G:\\AI_AGENT\\阶段01：大模型人工智能语言（25年7月开班）\\1.笔记\\Python1.0.docx";
const expected = {
  modules: 17,
  sections: 106,
  topics: 343,
  images: 130,
  tables: 29,
};

const course = JSON.parse(readFileSync(coursePath, "utf8"));
const totals = {
  modules: course.length,
  sections: 0,
  topics: 0,
  blocks: 0,
  paragraphs: 0,
  headings: 0,
  lists: 0,
  code: 0,
  images: 0,
  tables: 0,
};
const invalidBlocks = [];
const missingImages = [];
const lowContentTopics = [];

const incrementKind = (kind) => {
  if (kind === "paragraph") totals.paragraphs += 1;
  if (kind === "heading") totals.headings += 1;
  if (kind === "list") totals.lists += 1;
  if (kind === "code") totals.code += 1;
  if (kind === "image") totals.images += 1;
  if (kind === "table") totals.tables += 1;
};

for (const module of course) {
  totals.sections += module.sections.length;

  for (const section of module.sections) {
    totals.topics += section.topics.length;

    for (const topic of section.topics) {
      const blocks = topic.contentBlocks ?? [];
      totals.blocks += blocks.length;

      if (blocks.length <= 1) {
        lowContentTopics.push(`${module.title}/${section.title}/${topic.title}`);
      }

      for (const [index, block] of blocks.entries()) {
        incrementKind(block.kind);
        const location = `${module.id}/${section.id}/${topic.id}#${index}`;

        if (block.kind === "paragraph" && !block.text?.trim()) invalidBlocks.push(`${location}:empty paragraph`);
        if (block.kind === "heading" && !block.text?.trim()) invalidBlocks.push(`${location}:empty heading`);
        if (block.kind === "code" && !block.code?.trim()) invalidBlocks.push(`${location}:empty code`);
        if (block.kind === "list" && !block.items?.some((item) => item.trim())) {
          invalidBlocks.push(`${location}:empty list`);
        }
        if (block.kind === "image" && !existsSync(join(publicRoot, block.src))) {
          missingImages.push(`${location}:${block.src}`);
        }
        if (
          block.kind === "table" &&
          (!Array.isArray(block.rows) || !block.rows.length || !block.rows.every((row) => row.length))
        ) {
          invalidBlocks.push(`${location}:invalid table`);
        }
      }
    }
  }
}

const readDocxStats = () => {
  if (!existsSync(docxPath)) return null;

  const script = String.raw`
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($env:COURSE_DOCX)
try {
  $entry = $zip.GetEntry('word/document.xml')
  $reader = [System.IO.StreamReader]::new($entry.Open())
  try { [xml]$xml = $reader.ReadToEnd() } finally { $reader.Dispose() }
  $ns = [System.Xml.XmlNamespaceManager]::new($xml.NameTable)
  $ns.AddNamespace('w','http://schemas.openxmlformats.org/wordprocessingml/2006/main')
  [pscustomobject]@{
    paragraphs = $xml.SelectNodes('//w:body/w:p', $ns).Count
    tables = $xml.SelectNodes('//w:body/w:tbl', $ns).Count
    drawings = $xml.SelectNodes('//w:drawing', $ns).Count
    media = ($zip.Entries | Where-Object { $_.FullName -like 'word/media/*' }).Count
  } | ConvertTo-Json -Compress
} finally {
  $zip.Dispose()
}
`;
  const result = spawnSync("powershell", ["-NoProfile", "-Command", script], {
    encoding: "utf8",
    env: { ...process.env, COURSE_DOCX: docxPath },
  });

  if (result.status !== 0) {
    return { error: result.stderr.trim() || "Unable to read docx." };
  }

  return JSON.parse(result.stdout);
};

const docxStats = readDocxStats();
const failures = [];
for (const key of ["modules", "sections", "topics", "images", "tables"]) {
  if (totals[key] !== expected[key]) failures.push(`${key}: expected ${expected[key]}, got ${totals[key]}`);
}
if (missingImages.length) failures.push(`missing images: ${missingImages.length}`);
if (invalidBlocks.length) failures.push(`invalid blocks: ${invalidBlocks.length}`);
if (docxStats && !docxStats.error && docxStats.tables !== totals.tables) {
  failures.push(`docx tables ${docxStats.tables} != json tables ${totals.tables}`);
}
if (docxStats && !docxStats.error && docxStats.drawings !== totals.images) {
  failures.push(`docx drawings ${docxStats.drawings} != json images ${totals.images}`);
}

const report = {
  course: totals,
  docx: docxStats ?? "not found",
  lowContentTopics: lowContentTopics.length,
  lowContentSamples: lowContentTopics.slice(0, 24),
  missingImages,
  invalidBlocks,
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
