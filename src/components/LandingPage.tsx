import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { SignInButton } from "@clerk/nextjs";
import { Zap, Sparkles, Shield, Bot, User } from 'lucide-react'
import Logo from '@/assets/logo.png'
import Image from 'next/image'

const TimelineAnimation = () => {
  const controls = useAnimation()
  const [step, setStep] = useState(0)

  useEffect(() => {
    const animateSequence = async () => {
      // Generate
      await controls.start("generate")
      setStep(1)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // AI Score
      await controls.start("aiScore")
      setStep(2)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Humanizing
      await controls.start("humanizing")
      setStep(3)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Humanized
      await controls.start("humanized")
      setStep(4)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Human Score
      await controls.start("humanScore")
      setStep(5)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Reset
      controls.start("reset")
      setStep(0)
    }

    animateSequence()
    const interval = setInterval(animateSequence, 12000)
    return () => clearInterval(interval)
  }, [controls])

  return (
    <div className="relative h-96 w-full max-w-2xl mx-auto mb-12 bg-gray-50 rounded-lg p-4">
      <motion.div
        className="absolute top-4 left-4 right-4 h-20 bg-white rounded-lg shadow-sm p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        variants={{
          generate: { opacity: 1, y: 0, transition: { duration: 1 } },
          aiScore: { opacity: 1, y: 0 },
          humanizing: { opacity: 1, y: 0 },
          humanized: { opacity: 1, y: 0 },
          humanScore: { opacity: 1, y: 0 },
          reset: { opacity: 0, y: 20, transition: { duration: 1 } }
        }}
      >
        <div className="flex items-center mb-2">
          {step < 4 ? <Bot className="w-6 h-6 mr-2 text-gray-600" /> : <User className="w-6 h-6 mr-2 text-gray-600" />}
          <span className="font-semibold text-gray-800">{step < 4 ? "AI Generated" : "Humanized"}</span>
        </div>
        <p className="text-sm font-mono text-gray-600">
          {step === 0 && "Generating AI content..."}
          {step === 1 && "Scoring AI content..."}
          {step === 2 && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Humanizing the AI content...
            </motion.span>
          )}
          {step >= 3 && step < 4 && "The quick brown fox jumps over the lazy dog."}
          {step >= 4 && "A swift fox leaps over a sleepy canine."}
        </p>
      </motion.div>
      
      <motion.div
        className="absolute top-28 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, scale: 0 }}
        animate={controls}
        variants={{
          generate: { opacity: 1, scale: 1, transition: { duration: 1 } },
          aiScore: { opacity: 1, scale: 1 },
          humanizing: { opacity: 1, scale: 1.2, transition: { duration: 1 } },
          humanized: { opacity: 1, scale: 1 },
          humanScore: { opacity: 1, scale: 1 },
          reset: { opacity: 0, scale: 0, transition: { duration: 1 } }
        }}
      >
        {step >= 1 && <Sparkles className="w-12 h-12 text-gray-800" />}
      </motion.div>
      
      <motion.div
        className="absolute bottom-4 left-4 right-4 h-20 bg-white rounded-lg shadow-sm p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        variants={{
          generate: { opacity: 0, y: 20 },
          aiScore: { opacity: 1, y: 0, transition: { duration: 1 } },
          humanizing: { opacity: 0.5, y: 0 },
          humanized: { opacity: 0.5, y: 0 },
          humanScore: { opacity: 1, y: 0, transition: { duration: 1 } },
          reset: { opacity: 0, y: 20, transition: { duration: 1 } }
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">AI Score:</span>
          <span className="text-sm font-mono">{step >= 2 && step < 5 ? "99%" : step >= 5 ? "2%" : "0%"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">Human Score:</span>
          <span className="text-sm font-mono">{step >= 2 && step < 5 ? "1%" : step >= 5 ? "98%" : "0%"}</span>
        </div>
      </motion.div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen text-black bg-gray-100 overflow-hidden font-sans">
      {/* Header with Logo */}
      <div className="absolute top-0 left-0 p-4">
  <div className="flex items-center">
    <Image src={Logo} alt="CogniShift Logo" width={40} height={40} />
    <span className="ml-2 text-xl font-bold">CogniShift</span>
  </div>
</div>

      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center px-4 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 text-center leading-tight"
        >
          AI to Human in a Snap!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl mb-12 text-center max-w-2xl text-gray-600"
        >
          Transform robotic chatter into smooth human banter with just one click.
        </motion.p>
        <TimelineAnimation />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SignInButton mode="modal">
            <Button className="bg-black text-white text-lg py-6 px-10 rounded-full hover:bg-gray-800 transition duration-300 ease-in-out">
              Experience the Magic!
            </Button>
          </SignInButton>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            Why CogniShift Stands Out
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Lightning Fast", description: "Generate and humanize content in seconds, not minutes." },
              { icon: Sparkles, title: "AI-Powered Brilliance", description: "Leverage cutting-edge AI models for high-quality content creation." },
              { icon: Shield, title: "Undetectable Output", description: "Our advanced humanization process ensures your content passes AI detection tests." },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <feature.icon className="w-12 h-12 mb-4 text-black" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            CogniShift in Action
          </h2>
          <div className="space-y-12">
            {[
              { step: 1, text: "Input your AI-generated content" },
              { step: 2, text: "Choose your desired humanization level" },
              { step: 3, text: "Receive humanized content with AI detection scores" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center"
              >
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mr-6">
                  {item.step}
                </div>
                <p className="text-xl text-gray-800">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            Who Can Benefit from CogniShift?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Content Creators", description: "Streamline your content production process while maintaining a unique voice." },
              { title: "Digital Marketers", description: "Create engaging, human-like content for various marketing channels effortlessly." },
              { title: "SEO Specialists", description: "Generate SEO-friendly content that reads naturally and ranks well." },
              { title: "Customer Support Teams", description: "Craft personalized responses quickly without sounding robotic." },
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Revolutionize Your Content?
          </h2>
          <p className="text-xl mb-12 text-gray-600">
            Join the future of AI-assisted content creation today.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <SignInButton mode="modal">
              <Button className="bg-black text-white text-lg py-6 px-10 rounded-full hover:bg-gray-800 transition duration-300 ease-in-out">
                Get Started with CogniShift
              </Button>
            </SignInButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">&copy; 2024 CogniShift. Transforming AI-generated content into human brilliance.</p>
        </div>
      </footer>
    </div>
  );
}
