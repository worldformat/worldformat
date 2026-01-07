# World Format

Reference implementation of the **World** text format.

This repository contains a minimal parser and related utilities
for reading and writing World documents.

The World format is a human-editable snapshot format designed for
small systems and human–AI workflows.

## Status

⚠️ Experimental.

- APIs may change without notice
- No stability or backward-compatibility guarantees
- Test coverage is minimal or nonexistent

## Specification

The format definition lives here:

https://worldformat.org

This repository follows the specification, but may lead or lag it
as the format evolves.

## Usage

This package is not published to npm.

It is intended to be consumed via a GitHub dependency:

```json
{
  "dependencies": {
    "worldformat": "github:worldformat/worldformat"
  }
}
```

## Scope

This repository may grow to include:

- parsers
- generators
- format utilities

It intentionally does **not** include:

- schema enforcement
- validation rules
- storage layers

Those concerns belong elsewhere.

## License

MIT