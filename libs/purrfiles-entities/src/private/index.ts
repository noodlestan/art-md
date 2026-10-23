// @index(['./*.{ts,tsx}', './!(private|parts|functions)*/index.{ts,tsx}'], f => `export * from '${f.path.replace(/\/index$/, '')}';`)
export * from './indexEntities.js';
export * from './resolveEntityExpressionParts.js';
export * from './types.js';
