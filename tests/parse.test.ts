import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "../src";

parseFixture("minimal.world"); // should pass
parseFixture("composition.world"); // should pass
parseFixture("invalid/attribute-without-node.world"); // should throw
parseFixture("invalid/unterminated-node.world"); // should throw

function parseFixture(path: string) {
  const fullPath = join(__dirname, "..", "fixtures", path);
  const text = readFileSync(fullPath, "utf8");
  const shouldThrow = path.startsWith("invalid/");

  if (shouldThrow) {
    let threw = false;
    try {
      parse(text);
    } catch {
      threw = true;
    }
    if (!threw) {
      throw new Error(`Expected parse to throw for ${path}`);
    }
    return;
  }

  parse(text);
}
