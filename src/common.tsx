export function assertIsDefined<T> (value: T): asserts value is NonNullable<T> {
	if (value === undefined || value === null) {
		throw new Error (`Error: valueの値が${value}です！`);
	}
}

export function assertIsNumber (value: unknown): asserts value is number {
	if (typeof (value) !== "number") {
		throw new Error (`Error: valueはnumber型ではありません！${typeof (value)}型です。`);
	}
}

export function assertIsString (value: unknown): asserts value is string {
	if (typeof (value) !== "string") {
		throw new Error (`Error: valueはstring型ではありません！${typeof (value)}型です。`);
	}
}

export function assertIsBoolean (value: unknown): asserts value is boolean {
	if (typeof (value) !== "boolean") {
		throw new Error (`Error: valueはboolean型ではありません！${typeof (value)}型です。`);
	}
}
