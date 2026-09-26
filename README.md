# Art MD

> Express structured data in Markdown with an extensible language that enables human and machine authoring at scale and automated transformations.

![](https://raw.githubusercontent.com/noodlestan/artificial/refs/heads/main/assets/art-md-banner-800x400.png)

Language specification and JavaScript libraries for extracting structured data into a MDAST derived AST, with an open construct registry. Provides parsing, validation, transformation, and serialization of Art MD content.

**Website:** https://art-md.noodlestan.org

## Packages

| namespace | dir                | package               | description                                |
| --------- | ------------------ | --------------------- | ------------------------------------------ |
| `@art-md` | `spec/`            | `@art-md/spec`        | Art Language specification                 |
| `@art-md` | `libs/primitives/` | `@art-md/primitives`  | Foundational types and utilities           |
| `@art-md` | `libs/parser/`     | `@art-md/parser`      | Parses markdown/art to Art AST             |
| `@art-md` | `libs/serializer/` | `@art-md/serializer`  | Serializes Art AST back to markdown        |
| `@art-md` | `libs/constructs/` | `@art-md/constructs`  | Construct factories for Art parser records |
| `@art-md` | `libs/codec/`      | `@art-md/codec`       | Configured codec implementation            |
| `@art-md` | `cli/codec-tests`  | `@art-md/codec-tests` | Test scripts for the parser and serializer |
| `@art-md` | `cli/bin/`         | `@art-md/bin`         | CLI for parser/serialization. commands     |

## Development

### Scripts

- **$** `npm run turbo build` — Build all packages.
- **$** `npm run turbo test` — Run tests in all packages.
- **$** `npm run turbo lint` — Lint all packages (Prettier + ESLint).
- **$** `npm run ci` — Run all CI scripts in all packages.

## License

MIT License

Copyright (c) 2026 Noodlestan https://noodlestan.org/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
