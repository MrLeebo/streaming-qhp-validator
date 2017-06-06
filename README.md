# streaming-qhp-validator

This is the validator from [coverage-validator](https://github.com/adhocteam/coverage-validator) as a NodeJS utility with streaming, allowing it to validate very large provider.json or plan.json files without reading the entire file into memory.

## Usage

```bash
npm install --global streaming-qhp-validator

streaming-qhp-validator providers ./provider.json
streaming-qhp-validator plans ./plan.json
```
