"use client";

import { useState, useEffect, useCallback } from "react";
import { Trophy, Timer, Hammer } from "lucide-react";
import Rock from "./components/Rock";
import { generateRocks, type RockType } from "./utils/rockUtils";
import BackgroundScene from "./components/BackgroundScene";
import StartTimer from "./components/StartTimer";
import GameEndScene from "./components/GameEndScene";

const GAME_DURATION = 60;

export default function RockBreakingGame() {
	const [rocks, setRocks] = useState<RockType[]>([]);
	const [points, setPoints] = useState(0);
	const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
	const [gameStarted, setGameStarted] = useState(false);
	const [gameEnded, setGameEnded] = useState(false);
	const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
	const [showReward, setShowReward] = useState(false);
	const [earnedPoints, setEarnedPoints] = useState(0);

	useEffect(() => {
		setAudioContext(
			new (window.AudioContext || (window as any).webkitAudioContext)()
		);
	}, []);

	// Game logic remains the same
	useEffect(() => {
		if (gameStarted && !gameEnded) {
			setRocks(generateRocks(10));
			const rockInterval = setInterval(() => {
				setRocks((prevRocks) => {
					const updatedRocks = prevRocks
						.map((rock) => ({
							...rock,
							decay: rock.decay - 1,
						}))
						.filter((rock) => rock.decay > 0);

					if (updatedRocks.length < 10) {
						return [
							...updatedRocks,
							...generateRocks(10 - updatedRocks.length),
						];
					}
					return updatedRocks;
				});
			}, 500);

			const timerInterval = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						clearInterval(rockInterval);
						clearInterval(timerInterval);
						setGameEnded(true);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			return () => {
				clearInterval(rockInterval);
				clearInterval(timerInterval);
			};
		}
	}, [gameStarted, gameEnded]);

	// Sound logic remains the same
	const playSound = useCallback(
		(frequency: number) => {
			if (audioContext) {
				const oscillator = audioContext.createOscillator();
				const gainNode = audioContext.createGain();
				oscillator.type = "sine";
				oscillator.frequency.setValueAtTime(
					frequency,
					audioContext.currentTime
				);
				oscillator.connect(gainNode);
				gainNode.connect(audioContext.destination);
				gainNode.gain.setValueAtTime(1, audioContext.currentTime);
				gainNode.gain.exponentialRampToValueAtTime(
					0.001,
					audioContext.currentTime + 0.5
				);
				oscillator.start();
				oscillator.stop(audioContext.currentTime + 0.5);
			}
		},
		[audioContext]
	);

	const handleRockClick = (id: number) => {
		setRocks((prevRocks) => {
			return prevRocks
				.map((rock) => {
					if (rock.id === id) {
						const newStrength = rock.strength - 1;
						playSound(220 + rock.strength * 30);
						if (newStrength <= 0) {
							const points = rock.points;
							if (points > 0) {
								setEarnedPoints(points / 2);
								setShowReward(true);
								setTimeout(() => setShowReward(false), 1000);
								setPoints((prev) => prev + points / 2);
							}
							return { ...rock, strength: 0 };
						}
						return { ...rock, strength: newStrength };
					}
					return rock;
				})
				.filter((rock) => rock.strength > 0);
		});
	};

	const handleStartGame = () => {
		setGameStarted(true);
		setTimeLeft(GAME_DURATION);
		setPoints(0);
	};

	const handleRestartGame = () => {
		setGameEnded(false);
		setGameStarted(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-zinc-900 p-6">
			<div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
				<div className="flex-1 space-y-6">
					{/* Stats Bar */}
					<div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900">
						<div className="flex items-center justify-between gap-4">
							<div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-lg">
								<Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
								<div>
									<div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
										Points
									</div>
									<div className="text-2xl font-bold">{points}</div>
								</div>
							</div>
							<div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-lg">
								<Timer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
								<div>
									<div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
										Time
									</div>
									<div className="text-2xl font-bold">{timeLeft}s</div>
								</div>
							</div>
							{showReward && (
								<div className="absolute top-4 right-4 animate-bounce bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-lg flex items-center gap-2">
									<Trophy className="w-5 h-5" />
									<span>+{earnedPoints} points!</span>
								</div>
							)}
						</div>
					</div>

					{/* Game Container */}
					<div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900 relative min-h-[600px]">
						<div className="absolute inset-0 rounded-xl overflow-hidden">
							<BackgroundScene />
							{!gameStarted ? (
								<StartTimer onComplete={handleStartGame} />
							) : gameEnded ? (
								<GameEndScene points={points} onRestart={handleRestartGame} />
							) : (
								<div className="absolute inset-0 flex items-center justify-center">
									{rocks.map((rock) => (
										<Rock
											key={rock.id}
											rock={rock}
											onClick={() => handleRockClick(rock.id)}
										/>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Game Info Panel */}
				<aside className="lg:w-80 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900 sticky top-6 self-start">
					<h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-6">
						Game Stats
					</h3>
					<div className="flex flex-col items-center mb-6">
						<div className="w-24 h-24 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
							<Hammer className="w-12 h-12 text-purple-600 dark:text-purple-400" />
						</div>
						<h4 className="text-xl font-bold mb-1">Rock Breaker</h4>
						<p className="text-gray-600 dark:text-gray-400">
							Break rocks to earn points!
						</p>
					</div>

					<div className="space-y-4">
						<StatBar
							label="Score"
							value={points}
							max={1000}
							color="bg-purple-500"
						/>
						<StatBar
							label="Time Left"
							value={timeLeft}
							max={GAME_DURATION}
							color="bg-blue-500"
						/>
						<StatBar
							label="Rocks Broken"
							value={Math.floor(points / 5)}
							max={100}
							color="bg-green-500"
						/>
					</div>
				</aside>
			</div>
		</div>
	);
}

function StatBar({ label, value, max, color }) {
	const percentage = (value / max) * 100;
	return (
		<div className="group">
			<div className="flex justify-between text-sm font-medium mb-2">
				<span>{label}</span>
				<span className="text-gray-600 dark:text-gray-400">{value}</span>
			</div>
			<div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
				<div
					className={`h-full ${color} transition-all duration-500 ease-out group-hover:opacity-90`}
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
}
