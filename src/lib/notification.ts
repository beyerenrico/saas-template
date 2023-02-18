import { writable } from 'svelte/store';

export const notifications = writable<App.Notification[]>([]);

export function toast(data: App.Notification) {
	notifications.update((state) => [data, ...state]);
	setTimeout(removeToast, 5000);
}

function removeToast() {
	notifications.update((state) => {
		return [...state.slice(0, state.length - 1)];
	});
}
