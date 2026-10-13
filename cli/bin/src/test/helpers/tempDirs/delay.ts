/** @provides a delay used to retry transient filesystem operations */
export function delay(timeout: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, timeout));
}
