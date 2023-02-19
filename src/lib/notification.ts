import { writable, derived, type Readable } from 'svelte/store';

function createNotificationStore() {
	const _notifications = writable<App.Notification[]>([]);

	function send(data: App.Notification) {
		_notifications.update((state) => {
			return [...state, data];
		});
	}

	const notifications: Readable<App.Notification[]> = derived(
		_notifications,
		($_notifications, set) => {
			set($_notifications);
			if ($_notifications.length > 0) {
				const timer = setTimeout(() => {
					_notifications.update((state) => {
						state.shift();
						return state;
					});
				}, $_notifications[0].timeout);
				return () => {
					clearTimeout(timer);
				};
			}
		}
	);
	const { subscribe } = notifications;

	return {
		subscribe,
		send,
		enqueue: (data: App.Notification) => send(data)
	};
}

export const notifications = createNotificationStore();
