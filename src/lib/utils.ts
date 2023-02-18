import type { SubmitFunction } from '$app/forms';

import { toast } from './notification';

export const serializeNonPOJOs = (obj: Record<string, unknown>) => {
	return structuredClone(obj);
};

export const defaultEnhanceFunction: SubmitFunction = () => {
	return async ({ result, update }) => {
		switch (result.type) {
			case 'success':
				toast({
					kind: result.type,
					title: 'Success',
					caption: new Date().toLocaleString()
				});
				break;
			case 'error':
				toast({
					kind: result.type,
					title: 'An error has occured',
					caption: new Date().toLocaleString()
				});
				break;
			case 'failure':
				toast({
					kind: 'error',
					title: 'Something went wrong',
					caption: new Date().toLocaleString()
				});
				break;
			default:
				break;
		}

		update();
	};
};

export const noClearEnhanceFunction: SubmitFunction = () => {
	return async ({ result }) => {
		switch (result.type) {
			case 'success':
				toast({
					kind: result.type,
					title: 'Success',
					caption: new Date().toLocaleString()
				});
				break;
			case 'error':
				toast({
					kind: result.type,
					title: 'An error has occured',
					caption: new Date().toLocaleString()
				});
				break;
			case 'failure':
				toast({
					kind: 'error',
					title: 'Something went wrong',
					caption: new Date().toLocaleString()
				});
				break;
			default:
				break;
		}
	};
};
