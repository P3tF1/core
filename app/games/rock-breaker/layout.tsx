import "./globals.css";
import type React from "react";

export const metadata = {
	title: "Advanced Rock Breaking Game",
	description:
		"Break rocks, avoid decay, and earn points in this fast-paced game!",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div>{children}</div>;
}
