import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
	title: "v0 App",
	description: "Created with v0",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<div>{children}</div>
		</div>
	);
}
