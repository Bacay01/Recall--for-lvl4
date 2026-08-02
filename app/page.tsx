import React from "react";
import Link from "next/link";
import TiltWrapper from "./components/TiltWrapper";
import FlashcardDemo from "./components/FlashcardDemo";

const steps = [
  {
    number: "01",
    title: "Paste your notes",
    desc: "Drop in a lecture summary, textbook paragraph, or your own scribbled notes — any block of text works.",
  },
  {
    number: "02",
    title: "AI builds your cards",
    desc: "Your notes are turned into question-and-answer flashcards in seconds, ready to study.",
  },
  {
    number: "03",
    title: "Study, one card at a time",
    desc: "Flip through your deck, track your progress, and go again until it sticks.",
  },
];

const LandingPage = () => {
  return (
    <main>
      {/* NAV */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="font-display font-semibold text-lg">Recall</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:underline">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="font-mono text-xs tracking-wide text-dark/50 uppercase">
            Notes in, flashcards out
          </span>
          <h1 className="font-display font-semibold text-4xl md:text-5xl leading-[1.1] mt-4 mb-6">
            Turn any notes into a deck you can actually study.
          </h1>
          <p className="text-lg text-dark/70 max-w-md mb-8">
            Paste your notes, and Recall builds question-and-answer flashcards
            for you — so you spend your time studying, not making study cards.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-primary text-white font-medium px-7 py-3.5 rounded-lg hover:opacity-90"
          >
            Try it free
          </Link>
        </div>

        <TiltWrapper containerHeight="384px" containerWidth="288px">
          <FlashcardDemo />
        </TiltWrapper>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-dark py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display font-semibold text-3xl text-bg mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step) => (
              <div key={step.number}>
                <span className="font-mono text-sm text-accent">
                  {step.number}
                </span>
                <h3 className="font-display font-semibold text-xl text-bg mt-3 mb-2">
                  {step.title}
                </h3>
                <p className="text-bg/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* FOOTER CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display font-semibold text-3xl mb-6">
          Ready to stop making flashcards by hand?
        </h2>
        <Link
          href="/signup"
          className="inline-block bg-primary text-white font-medium px-7 py-3.5 rounded-lg hover:opacity-90"
        >
          Create your first deck
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-dark/10">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display font-semibold text-lg">Recall</span>

          <div className="flex items-center gap-6 text-sm text-dark/60">
            <Link href="/login" className="hover:text-dark">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-dark">
              Sign up
            </Link>
            <a href="mailto:hello@recall.app" className="hover:text-dark">
              Contact
            </a>
          </div>

          <span className="text-sm text-dark/40">
            © {new Date().getFullYear()} Recall. Built for students.
          </span>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;