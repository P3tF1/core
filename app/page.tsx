"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  PawPrint,
  Wallet,
  Dumbbell,
  Brain,
  Coins,
  ShoppingBag,
  Twitter,
  DiscIcon as Discord,
  Github,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const { isConnected } = useAppKitAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      const timeout = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isConnected, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <Header />
      <main>
        <Hero scrollYProgress={scrollYProgress} />
        <Features scrollYProgress={scrollYProgress} />
        <HowItWorks scrollYProgress={scrollYProgress} />
        <PetShowcase scrollYProgress={scrollYProgress} />
        <CallToAction scrollYProgress={scrollYProgress} />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full z-10 bg-gradient-to-r from-purple-600 to-indigo-600 bg-opacity-70 backdrop-blur-md shadow-md"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center space-x-2"
          aria-label="Home"
        >
          <PawPrint className="w-8 h-8 text-yellow-400" />
          <span className="text-2xl font-bold text-yellow-400">PetFi</span>
        </Link>

        <nav>
          <ul className="flex items-center space-x-8">
            <li>
              <appkit-button />
            </li>
          </ul>
        </nav>
      </div>
    </motion.header>
  );
}

function Hero({ scrollYProgress }) {
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const { isConnected } = useAppKitAccount();
  return (
    <motion.section
      className="pt-32 pb-20 px-4 relative"
      style={{ y, opacity }}
    >
      <div className="container mx-auto text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold mb-6 text-indigo-600"
        >
          Welcome to PetFi
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl mb-8 max-w-2xl mx-auto text-gray-600"
        >
          The Web3 blockchain game where you nurture virtual pets, compete in
          mini-games, and earn real rewards!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center"
        >
          {isConnected ? (
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <div className="flex items-center">
                Redirecting to Dashboard...
              </div>
            </Button>
          ) : (
            <appkit-button sz="md" label="Connect Wallet to Start" />
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}

function Features({ scrollYProgress }) {
  const features = [
    {
      icon: <Dumbbell className="w-12 h-12 text-indigo-600" />,
      title: "Enhance Pet Stats",
      description:
        "Feed your pet different items to improve strength, intelligence, and more.",
    },
    {
      icon: <Brain className="w-12 h-12 text-indigo-600" />,
      title: "Play-to-Earn Games",
      description:
        "Compete in mini-games where both your skills and your pet's stats matter.",
    },
    {
      icon: <Coins className="w-12 h-12 text-indigo-600" />,
      title: "Earn PetFi Tokens",
      description:
        "Win games and complete tasks to earn PetFi Tokens, our in-game currency.",
    },
    {
      icon: <ShoppingBag className="w-12 h-12 text-indigo-600" />,
      title: "NFT Marketplace",
      description: "Trade your unique pet NFTs across multiple blockchains.",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 relative bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-indigo-600">
          Game Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="bg-indigo-50 p-6 rounded-lg shadow-lg border border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-indigo-100 hover:shadow-xl"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ scrollYProgress }) {
  const steps = [
    {
      title: "Connect Your Wallet",
      description: "Link your Web3 wallet to start your PetFi journey.",
      icon: <Wallet className="w-12 h-12 text-white" />,
    },
    {
      title: "Mint Your Pet NFT",
      description:
        "Create your unique virtual pet as an NFT on the blockchain.",
      icon: <PawPrint className="w-12 h-12 text-white" />,
    },
    {
      title: "Train and Nurture",
      description: "Feed and care for your pet to improve its stats.",
      icon: <Dumbbell className="w-12 h-12 text-white" />,
    },
    {
      title: "Compete and Earn",
      description: "Join mini-games and earn PetFi Tokens as rewards.",
      icon: <Coins className="w-12 h-12 text-white" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 relative bg-indigo-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-indigo-600">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center"
            >
              <div className="mb-4 relative">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                  {step.icon}
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold border-2 border-indigo-600 text-indigo-600">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-600">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PetShowcase({ scrollYProgress }) {
  const pets = [
    {
      name: "Strength Pet",
      image: "/placeholder.svg?height=300&width=300",
      description: "Excels in physical challenges",
    },
    {
      name: "Intelligence Pet",
      image: "/placeholder.svg?height=300&width=300",
      description: "Masters puzzle-based games",
    },
    {
      name: "Agility Pet",
      image: "/placeholder.svg?height=300&width=300",
      description: "Dominates in speed-based contests",
    },
  ];

  return (
    <section id="pets" className="py-20 px-4 relative bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-indigo-600">
          Meet the Pets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pets.map((pet, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="bg-indigo-50 rounded-lg overflow-hidden shadow-lg border border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-indigo-100 hover:shadow-xl"
            >
              <Image
                src={pet.image || "/placeholder.svg"}
                alt={pet.name}
                width={300}
                height={300}
                className="w-full"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-indigo-600">
                  {pet.name}
                </h3>
                <p className="text-gray-600">{pet.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToAction({ scrollYProgress }) {
  const scale = useTransform(scrollYProgress, [1, 1], [1, 1]);
  const opacity = useTransform(scrollYProgress, [0.8, 1], [0.8, 1]);
  const { isConnected } = useAppKitAccount();
  return (
    <motion.section
      className="py-20 px-4 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"
      style={{ scale, opacity }}
    >
      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-xl"
        >
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Start Your PetFi Adventure?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-200">
            Connect your wallet now and join the exciting world of blockchain
            pet care and play-to-earn gaming!
          </p>
          <div className="flex justify-center">
            {isConnected ? (
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-indigo-800 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center">
                  Redirecting to Dashboard...
                </div>
              </Button>
            ) : (
              <appkit-button sz="lg" label="Connect Wallet to Start" />
            )}
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
    </motion.section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <PawPrint className="w-8 h-8 text-indigo-600 mr-2" />
            <span className="text-2xl font-bold text-indigo-600">PetFi</span>
          </div>
          <nav className="mb-4 md:mb-0">
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="#features"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="hover:text-indigo-600 transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#pets"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Pets
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Twitter />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Discord />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Github />
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PetFi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
