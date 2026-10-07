const ART_DOCUMENT_JSON = {
	construct: 'Document',
	children: [
		{
			construct: 'SectionBlock',
			name: 'Title',
			children: [
				{
					children: [
						{
							construct: 'NaturalExpression',
							type: 'text',
							attributes: {},
							value: 'Some prose.',
							position: {
								start: { line: 3, column: 1, offset: 9 },
								end: { line: 3, column: 12, offset: 20 },
							},
							children: [],
						},
					],
					position: {
						start: { line: 3, column: 1, offset: 9 },
						end: { line: 3, column: 12, offset: 20 },
					},
					construct: 'NaturalBlock',
					value: 'Some prose.',
					type: 'paragraph',
				},
			],
			depth: 1,
			position: {
				start: { line: 1, column: 1, offset: 0 },
				end: { line: 1, column: 8, offset: 7 },
			},
		},
	],
	position: {
		start: { line: 1, column: 1, offset: 0 },
		end: { line: 3, column: 12, offset: 20 },
	},
};

export function makeArtDocumentJSONFixture(): string {
	return JSON.stringify(ART_DOCUMENT_JSON);
}
