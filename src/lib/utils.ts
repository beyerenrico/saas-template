import type { SubmitFunction } from '$app/forms';

import { notifications } from './notification';

export const serializeNonPOJOs = (obj: Record<string, unknown>) => {
	return structuredClone(obj);
};

export const defaultEnhanceFunction: SubmitFunction = () => {
	return async ({ result, update }) => {
		switch (result.type) {
			case 'success':
				notifications.enqueue({
					kind: result.type,
					title: 'Success',
					caption: new Date().toLocaleString(),
					timeout: 5000
				});
				break;
			case 'error':
				notifications.enqueue({
					kind: result.type,
					title: 'An error has occured',
					caption: new Date().toLocaleString(),
					timeout: 5000
				});
				break;
			case 'failure':
				notifications.enqueue({
					kind: 'error',
					title: 'Something went wrong',
					caption: new Date().toLocaleString(),
					timeout: 5000
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
				notifications.enqueue({
					kind: result.type,
					title: 'Success',
					caption: new Date().toLocaleString(),
					timeout: 5000
				});
				break;
			case 'error':
				notifications.enqueue({
					kind: result.type,
					title: 'An error has occured',
					caption: new Date().toLocaleString(),
					timeout: 5000
				});
				break;
			case 'failure':
				notifications.enqueue({
					kind: 'error',
					title: 'Something went wrong',
					caption: new Date().toLocaleString(),
					timeout: 5000
				});
				break;
			default:
				break;
		}
	};
};
