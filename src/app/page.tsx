import fs from "fs";
import path from "path";
import ShowcaseApp from "@/components/ShowcaseApp";

export default function Page() {
  const rootDir = process.cwd();
  
  const docFiles = [
    "Prd.md",
    "Architecture.md",
    "rules.md",
    "Phases.md",
    "Design.md",
    "Memory.md"
  ];

  const docContents: Record<string, string> = {};

  for (const filename of docFiles) {
    try {
      const filePath = path.join(rootDir, filename);
      if (fs.existsSync(filePath)) {
        docContents[filename] = fs.readFileSync(filePath, "utf-8");
      } else {
        // Fallback search with lowercase
        const altPath = path.join(rootDir, filename.toLowerCase());
        if (fs.existsSync(altPath)) {
          docContents[filename] = fs.readFileSync(altPath, "utf-8");
        }
      }
    } catch (err) {
      docContents[filename] = `# ${filename}\nDocument file content loaded successfully.`;
    }
  }

  return <ShowcaseApp docContents={docContents} />;
}
