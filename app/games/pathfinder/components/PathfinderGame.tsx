// PathfinderGame.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { generateMaze, findPath } from "../utils/mazeUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PathfinderGameProps {
	mindLevel: number;
	onGameComplete: (score: number) => void;
}

const PathfinderGame: React.FC<PathfinderGameProps> = ({
	mindLevel,
	onGameComplete,
}) => {
	const [maze, setMaze] = useState<number[][]>([]);
	const [playerPosition, setPlayerPosition] = useState<[number, number]>([
		0, 0,
	]);
	const [goalPosition, setGoalPosition] = useState<[number, number]>([0, 0]);
	const [moves, setMoves] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [score, setScore] = useState(0);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [elapsedTime, setElapsedTime] = useState<number>(0);

	useEffect(() => {
		if (startTime === null) {
			setStartTime(Date.now());
		}
	}, []);

	useEffect(() => {
		if (startTime) {
			const interval = setInterval(() => {
				setElapsedTime((Date.now() - startTime) / 1000);
			}, 100);

			return () => clearInterval(interval);
		}
	}, [startTime]);

	useEffect(() => {
		initializeGame();
	}, []);

	const initializeGame = () => {
		const size = Math.min(5 + Math.floor(mindLevel / 10), 15);
		let newMaze, path;

		do {
			newMaze = generateMaze(size, size, mindLevel);
			path = findPath(newMaze, [0, 0], [size - 1, size - 1]);
		} while (path.length === 0);

		setMaze(newMaze);
		setPlayerPosition([0, 0]);
		setGoalPosition([size - 1, size - 1]);
		setMoves(0);
		setGameOver(false);
		setScore(0);
		setStartTime(Date.now());
		setElapsedTime(0);
	};

	const handleMove = (direction: "up" | "down" | "left" | "right") => {
		if (gameOver) return;

		const [row, col] = playerPosition;
		let newRow = row;
		let newCol = col;
		let update = true;
		switch (direction) {
			case "up":
				if (row === 0) {
					update = false;
				}
				newRow = Math.max(0, row - 1);
				break;
			case "down":
				if (row === maze.length - 1) {
					update = false;
				}
				newRow = Math.min(maze.length - 1, row + 1);
				break;
			case "left":
				if (col === 0) {
					update = false;
				}
				newCol = Math.max(0, col - 1);
				break;
			case "right":
				if (col === maze[0].length - 1) {
					update = false;
				}
				newCol = Math.min(maze[0].length - 1, col + 1);
				break;
		}

		if (maze[newRow][newCol] !== 1) {
			setPlayerPosition([newRow, newCol]);
			if (update) {
				setMoves((prevMoves) => prevMoves + 1);
			}
			if (startTime) {
				setElapsedTime((Date.now() - startTime) / 1000);
			}

			if (newRow === goalPosition[0] && newCol === goalPosition[1]) {
				const optimalPath = findPath(maze, [0, 0], goalPosition);
				const scoreMultiplier = Math.max(1, mindLevel / 10);
				const timeBonus = Math.max(0, 50 - elapsedTime) * 2;
				const calculatedScore = Math.round(
					(optimalPath.length / Math.max(1, moves + 1)) *
						100 *
						scoreMultiplier +
						timeBonus
				);

				setScore(calculatedScore);
				setGameOver(true);
				setStartTime(null);
				onGameComplete(calculatedScore);
			}
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-900 shadow-lg">
			<CardHeader className="text-center space-y-2">
				<CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
					Pathfinder Minigame
				</CardTitle>
				<div className="flex justify-center gap-8 text-sm text-muted-foreground">
					<div>Mind Level: {mindLevel}</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Maze Grid */}
				<div className="flex justify-center">
					<div className="border-2 border-purple-500 rounded-lg overflow-hidden p-1 bg-purple-50 dark:bg-purple-950">
						{maze.map((row, rowIndex) => (
							<div key={rowIndex} className="flex">
								{row.map((cell, colIndex) => (
									<div
										key={`${rowIndex}-${colIndex}`}
										className={`w-8 h-8 border border-purple-200 dark:border-purple-800 transition-colors duration-200 ${
											cell === 1
												? "bg-gray-800 dark:bg-gray-700"
												: rowIndex === playerPosition[0] &&
												  colIndex === playerPosition[1]
												? "bg-green-500 dark:bg-green-600"
												: rowIndex === goalPosition[0] &&
												  colIndex === goalPosition[1]
												? "bg-yellow-400 dark:bg-yellow-500"
												: "bg-white dark:bg-zinc-800"
										}`}
									/>
								))}
							</div>
						))}
					</div>
				</div>

				{/* Controls */}
				<div className="flex justify-center gap-2">
					<Button
						variant="outline"
						onClick={() => handleMove("up")}
						className="w-20 hover:bg-purple-100 dark:hover:bg-purple-900 dark:border-purple-700"
					>
						Up
					</Button>
					<Button
						variant="outline"
						onClick={() => handleMove("down")}
						className="w-20 hover:bg-purple-100 dark:hover:bg-purple-900 dark:border-purple-700"
					>
						Down
					</Button>
					<Button
						variant="outline"
						onClick={() => handleMove("left")}
						className="w-20 hover:bg-purple-100 dark:hover:bg-purple-900 dark:border-purple-700"
					>
						Left
					</Button>
					<Button
						variant="outline"
						onClick={() => handleMove("right")}
						className="w-20 hover:bg-purple-100 dark:hover:bg-purple-900 dark:border-purple-700"
					>
						Right
					</Button>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-3 gap-4 text-sm">
					<div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md text-center">
						<div className="font-medium">Moves</div>
						<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
							{moves}
						</div>
					</div>
					<div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md text-center">
						<div className="font-medium">Score</div>
						<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
							{score}
						</div>
					</div>
					<div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md text-center">
						<div className="font-medium">Time</div>
						<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
							{elapsedTime.toFixed(0)}s
						</div>
					</div>
				</div>

				{/* Game Over */}
				{gameOver && (
					<div className="text-center space-y-4 bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
						<h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
							Game Over!
						</h2>
						<p className="text-lg">Final Score: {score}</p>
						<Button
							onClick={initializeGame}
							className="bg-purple-600 hover:bg-purple-700 text-white"
						>
							Play Again
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default PathfinderGame;
