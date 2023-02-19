import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte';

import { writable } from 'svelte/store';

export const theme = writable<CarbonTheme>('g90');
export const globalFontSize = writable<string>('16');
