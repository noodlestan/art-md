import type {
	ModuleEntityData,
	ModuleEntityFiles,
	ModuleEntityPartial,
} from '@noodlestan/purrfiles-entities';
import { createProgram, createProgramFilesContext } from '@purrception/lang-ts-extract';
import { type DirectoryEntityProcessor, createEntityExtractContext } from '@purrception/source-fs';

/**
 * Collapses declarations sharing the same name into a single entry.
 *
 * Function overloads yield one declaration per signature; the first one is kept
 * as the canonical declaration, mirroring how the declared symbols are indexed.
 */
function uniqueDeclarations<T extends { name: string }>(declarations: T[]): T[] {
	const seen = new Set<string>();

	return declarations.filter(declaration => {
		if (seen.has(declaration.name)) {
			return false;
		}
		seen.add(declaration.name);
		return true;
	});
}

export const entityExtractor: DirectoryEntityProcessor<
	ModuleEntityPartial,
	ModuleEntityFiles,
	ModuleEntityData
> = async (ctx, partial, files) => {
	const entityContext = createEntityExtractContext(ctx, partial);
	const programContext = createProgramFilesContext(ctx.dirMeta.path, ctx.readFile);
	const program = await createProgram(programContext, files);

	const docs = files.index ? program.extractDocs(files.index) : undefined;
	const functions = uniqueDeclarations(program.extractFunctions(files.functions));
	const types = files.types ? program.extractTypes(files.types) : [];

	const imported = program.extractImportedSymbols();
	const declared = program.indexDeclaredSymbols(functions, types);

	return [
		{
			context: entityContext,
			entity: {
				...partial,
				...docs,
				functions: functions.map(fn => fn.name),
				symbols: {
					imported,
					declared,
				},
			},
		},
	];
};
