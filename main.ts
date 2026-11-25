// One Star for Monday — make.fun entry
// A one-star review of Monday, written as if Monday were a restaurant.
// Judge: weary office worker; needs a real diner's complaint (table, server,
// dish or bill gone wrong), a joke that only works for Monday, short and quotable.
// Gate: /output/entry.txt, UTF-8, 1-180 chars, not only whitespace; brief: <= 25 words.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

// Named parts of the review, assembled by buildLine() below.
const RATING = "One star.";
const TABLE = "Seated at the worst table,";
const DISH = "served cold coffee and a 9am meeting,";
const BILL = "then billed for the whole week.";

const LINE =
  "One star. Seated at the worst table, served cold coffee and a 9am meeting, then billed for the whole week.";

function buildLine(): string {
  return [RATING, TABLE, DISH, BILL].join(" ");
}

interface GateReport {
  chars: number;
  words: number;
  valid: boolean;
}

function validateEntry(text: string): GateReport {
  const chars = [...text].length;
  const words = text.split(/\s+/).length;
  const valid =
    chars >= 1 && chars <= 180 && words <= 25 && text.trim().length > 0;
  return { chars, words, valid };
}

function verifyWritten(target: string): string {
  const written = readFileSync(target, "utf8");
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function main(): void {
  const line = buildLine();
  if (line !== LINE) throw new Error("assembled line drifted from the entry");
  const report = validateEntry(line);
  if (!report.valid) {
    throw new Error(
      `gate failed: ${report.chars} code points, ${report.words} words`,
    );
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, line, "utf8");
  const sha = verifyWritten(target);
  console.log(
    `gate passes: ${report.chars} code points, ${report.words} words, sha256 ${sha}`,
  );
  console.log(`verified: ${JSON.stringify(line)}`);
}

main();
