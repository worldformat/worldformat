"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = parse;
exports.validate = validate;
function parseValue(raw) {
    // string
    if (raw.startsWith('"') && raw.endsWith('"')) {
        return raw.slice(1, -1);
    }
    // boolean
    if (raw === "true")
        return true;
    if (raw === "false")
        return false;
    // number
    return Number(raw);
}
function parse(text) {
    const root = {};
    const lines = text.split(/\r?\n/);
    let currentPath = null;
    let currentNode = null;
    for (const rawLine of lines) {
        const line = stripComment(rawLine);
        if (!line)
            continue;
        // Node declaration
        if (line.startsWith("[") && line.endsWith("]")) {
            const path = line.slice(1, -1).split("/");
            let cursor = root;
            for (let i = 0; i < path.length; i++) {
                const key = path[i];
                const isLeaf = i === path.length - 1;
                if (isLeaf) {
                    if (!(key in cursor)) {
                        cursor[key] = {};
                        currentNode = cursor[key];
                    }
                    else if (Array.isArray(cursor[key])) {
                        const obj = {};
                        cursor[key].push(obj);
                        currentNode = obj;
                    }
                    else {
                        const first = cursor[key];
                        const obj = {};
                        cursor[key] = [first, obj];
                        currentNode = obj;
                    }
                }
                else {
                    if (!(key in cursor)) {
                        cursor[key] = {};
                    }
                    else if (Array.isArray(cursor[key])) {
                        throw new Error(`Ambiguous parent path: "${path.slice(0, i + 1).join("/")}"`);
                    }
                    cursor = cursor[key];
                }
            }
            currentPath = path;
            continue;
        }
        // Attribute
        if (currentNode) {
            const idx = line.indexOf("=");
            if (idx === -1) {
                throw new Error(`Invalid line: "${line}"`);
            }
            const key = line.slice(0, idx).trim();
            const rawValue = line.slice(idx + 1).trim();
            currentNode[key] = parseValue(rawValue);
            continue;
        }
        // If we reach here, the line is invalid
        throw new Error(`Invalid line: "${line}"`);
    }
    return root;
}
function validate(text) {
    try {
        parse(text);
        return true;
    }
    catch {
        return false;
    }
}
function stripComment(line) {
    let inString = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            inString = !inString;
            continue;
        }
        if (ch === "#" && !inString) {
            return line.slice(0, i).trim();
        }
    }
    return line.trim();
}
