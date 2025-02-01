export function generateMaze(
	width: number,
	height: number,
	difficulty: number
): number[][] {
	const maze: number[][] = Array(height)
		.fill(0)
		.map(() => Array(width).fill(0));

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (x === 0 && y === 0) continue;
			if (x === width - 1 && y === height - 1) continue;

			const obstacleChance = Math.min(0.1 + difficulty / 100, 0.4);
			if (Math.random() < obstacleChance) {
				maze[y][x] = 1;
			}
		}
	}

	return maze;
}

export function findPath(
	maze: number[][],
	start: [number, number],
	goal: [number, number]
): [number, number][] {
	const queue: [number, number][] = [start];
	const visited: Set<string> = new Set();
	const parent: Map<string, [number, number]> = new Map();

	visited.add(`${start[0]},${start[1]}`);
	while (queue.length > 0) {
		const current = queue.shift()!;
		const [x, y] = current;

		if (x === goal[0] && y === goal[1]) {
			const path: [number, number][] = [];
			let curr: [number, number] | undefined = goal;
			while (curr) {
				path.unshift(curr);
				curr = parent.get(`${curr[0]},${curr[1]}`);
			}
			return path;
		}

		const neighbors: [number, number][] = [
			[x - 1, y],
			[x + 1, y],
			[x, y - 1],
			[x, y + 1],
		];

		for (const [nx, ny] of neighbors) {
			if (nx < 0 || ny < 0 || nx >= maze.length || ny >= maze[0].length)
				continue;
			if (maze[nx][ny] === 1) continue;

			const key = `${nx},${ny}`;
			if (visited.has(key)) continue;

			visited.add(key);
			parent.set(key, current);
			queue.push([nx, ny]);
		}
	}

	return [];
}
