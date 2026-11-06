/** The data a serialize context is built from: the target `uri`. */
export type SerializerContextData = {
	uri: string;
};

/** Identifies the document a serialization targets by its `uri`. */
export type SerializeContext = {
	uri: string;
};
