export const serializeNonPOJOs = (obj: Record<string, unknown>) => {
	return structuredClone(obj);
};
