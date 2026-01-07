import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "../src";

parseFixture("minimal.world", {
  task: {
    name: "Test",
    done: false,
  },
});

parseFixture("composition.world", {
  task: [
    { name: "A", priority: 1 },
    { name: "B", priority: 2 },
  ],
  project: {
    name: "Demo",
    subtask: {
      name: "Subtask 1",
      done: true,
      progress: 0.5,
    },
  },
});

parseFixture("invalid/ambiguous-array-parent.world"); // should throw
parseFixture("invalid/attribute-without-node.world"); // should throw
parseFixture("invalid/unterminated-node.world"); // should throw

function parseFixture(path: string, expected?: unknown) {
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

  const result = parse(text);

  if (expected !== undefined) {
    assertDeepEqual(result, expected);
  }
}

function assertDeepEqual(actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual, null, 2);
  const e = JSON.stringify(expected, null, 2);

  if (a !== e) {
    throw new Error(
      "Assertion failed:\n\nExpected:\n" + e + "\n\nActual:\n" + a,
    );
  }
}
