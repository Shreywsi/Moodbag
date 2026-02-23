import { useState, useEffect, useRef } from "react";
import "@tensorflow/tfjs"; // ← ADD THIS LINE
import * as use from "@tensorflow-models/universal-sentence-encoder";
import "./App.css";

// ─── SCENES DATABASE ──────────────────────────────────────────────────────────
// Each scene is described evocatively in PWB's spirit — not quoted, just captured.
// Multiple scenes per mood so different intensities get different matches.

const scenes = [
  {
    id: "s1",
    episode: "S1E1",
    title: "The Camera Look",
    moods: ["awkward", "funny"],
    description: "She does something spectacularly ill-advised and then turns to look directly at you — not for permission, not for reassurance, just to check you're watching. You are. You always are. That tiny conspiratorial glance that says: yes, this is a disaster, and yes, we're both in on it.",
    resonance: "For when you've done the thing and all you can do is acknowledge it happened.",
  },
  {
    id: "s2",
    episode: "S1E2",
    title: "The Café that Isn't Working",
    moods: ["funny", "grief", "bittersweet"],
    description: "She's running a failing café and pretending she isn't. Smiling at customers while the numbers quietly don't add up. There's something both absurd and deeply recognisable about performing competence when everything underneath is held together with the thinnest thread.",
    resonance: "For when you're managing fine, technically, but only just.",
  },
  {
    id: "s3",
    episode: "S1E4",
    title: "The Guinea Pig",
    moods: ["grief", "devastating", "cry"],
    description: "A story about a guinea pig that is not really about a guinea pig at all. It's about the specific cruelty of accidents, the way guilt settles in the body, and the things we carry that we never find the right words for. She tells it like it's nothing. It is everything.",
    resonance: "For when something small is standing in for something enormous.",
  },
  {
    id: "s4",
    episode: "S1E5",
    title: "The Feminist Lecture",
    moods: ["funny", "awkward", "bittersweet"],
    description: "A talk that goes exactly as wrong as it possibly could, in the most public way imaginable. She stands there absorbing the disaster with a face that has fully departed from the scene while her body remains. It is mortifying. It is also kind of heroic.",
    resonance: "For when you survived something embarrassing and need someone to nod at you.",
  },
  {
    id: "s5",
    episode: "S1E6",
    title: "The Thing She Did",
    moods: ["cry", "devastating", "shocking", "grief"],
    description: "The season ends and suddenly everything reshuffles. What you thought the show was about turns out to be a story about something else entirely — a loss so specific and so badly handled that it becomes unbearable and completely human at once. The last image sits in you for days.",
    resonance: "For when you're carrying guilt about something you can't fix.",
  },
  {
    id: "s6",
    episode: "S2E1",
    title: "The Confession Box",
    moods: ["cry", "grief", "heartfelt", "shocking"],
    description: "She walks into a confessional not entirely sure what she's confessing. What comes out isn't what either of them expected. There is something in the dim light of that wooden box — the anonymity, the permission — that makes the truest things finally speakable.",
    resonance: "For when you have something lodged in your chest that you haven't said out loud yet.",
  },
  {
    id: "s7",
    episode: "S2E2",
    title: "The Instant Chemistry",
    moods: ["flirty", "funny", "awkward"],
    description: "They meet. Something happens immediately that neither of them can quite explain or should probably pursue. The tension is so thick it becomes its own comedic presence in the room — a third party everyone pretends isn't there, badly.",
    resonance: "For when you met someone and your whole body became a problem.",
  },
  {
    id: "s8",
    episode: "S2E3",
    title: "The Hair",
    moods: ["flirty", "heartfelt", "tender"],
    description: "A single gesture — gentle, unbidden, over almost before it begins — that changes the entire temperature of a scene. He touches her hair. She lets him. The camera doesn't make a big thing of it. It doesn't need to. You feel it anyway, somewhere in your sternum.",
    resonance: "For when a small moment with someone meant more than either of you said.",
  },
  {
    id: "s9",
    episode: "S2E4",
    title: "The Family Dinner",
    moods: ["awkward", "bittersweet", "grief", "cry"],
    description: "Everyone is sitting around a table pretending. Pretending to be fine, pretending to like each other, pretending the absence in the room isn't sitting right there in the empty chair of it all. The politeness is excruciating. The love underneath it is, somehow, undeniable.",
    resonance: "For when family is complicated and you love them anyway, furiously.",
  },
  {
    id: "s10",
    episode: "S2E5",
    title: "The Kneel",
    moods: ["heartfelt", "tender", "bittersweet"],
    description: "A moment of unexpected softness from someone you thought was made entirely of sharp edges. They kneel. Something in the architecture of the scene shifts. It is generous and surprising and costs them something — and she receives it without knowing quite what to do with her hands.",
    resonance: "For when someone showed up for you in a way you didn't expect and didn't know you needed.",
  },
  {
    id: "s11",
    episode: "S2E6",
    title: "The Bus Stop",
    moods: ["devastating", "bittersweet", "cry", "heartfelt"],
    description: "The ending that ruins people. Two people at a bus stop understanding something simultaneously — what is possible, what is not, and what it costs to know the difference. She walks one way. He goes another. The camera holds. You are not okay.",
    resonance: "For when you understand exactly why something can't happen and it doesn't help at all.",
  },
  {
    id: "s12",
    episode: "S2E6",
    title: "The Last Look",
    moods: ["shocking", "devastating", "bittersweet"],
    description: "In the final moments, she turns to look at the camera one last time. And then she doesn't. It is the most significant thing that has ever happened in a look away. Phoebe Waller-Bridge tells you, without a word, that she's done talking to you — and that it's time to go deal with your own life.",
    resonance: "For when something has genuinely ended and you have to let it.",
  },
  {
    id: "s13",
    episode: "S2E3",
    title: "The Belfast Sermon",
    moods: ["funny", "heartfelt", "shocking", "flirty"],
    description: "He gives a sermon. She's in the pew. Neither of them is entirely behaving themselves, spiritually speaking. The words coming from the pulpit are ostensibly about God and are visibly about her. Everyone in the congregation can feel it. She can feel it. You can feel it.",
    resonance: "For when someone said something meant entirely for you, in front of everyone, deniably.",
  },
  {
    id: "s14",
    episode: "S1E3",
    title: "The Art Gallery",
    moods: ["funny", "awkward", "bittersweet"],
    description: "A fundraiser. A horrible stepmother. A performance of family that fools absolutely no one. She moves through the room like someone who has accepted that things will go wrong and has simply decided to be interesting about it. The chaos, when it arrives, is both inevitable and spectacular.",
    resonance: "For when a social event became a situation and you just had to ride it out.",
  },
  {
    id: "s15",
    episode: "S2E1",
    title: "The Therapist",
    moods: ["awkward", "funny", "grief"],
    description: "She goes to therapy and immediately tries to seduce the therapist. Not because she wants to — or maybe because she does, a little — but because intimacy is terrifying and deflection is a dialect she speaks fluently. The therapist is not seduced. The scene is devastating and very funny.",
    resonance: "For when you sabotage the thing that might actually help, just slightly.",
  },
];

// ─── MOOD TRAINING DATA ───────────────────────────────────────────────────────

const moodExamples = {
  cry: [
    "I feel completely heartbroken and empty inside",
    "I couldn't stop crying today, everything hurts",
    "I feel so alone and nobody understands me",
    "I miss them so much it physically aches",
    "I broke down today and couldn't hold it together",
    "Everything feels hopeless and I don't know what to do",
    "I sobbed in the bathroom at work today",
    "My heart is shattered and I don't know how to fix it",
    "I feel devastated and utterly lost",
    "I cried myself to sleep thinking about it",
    "The grief hit me out of nowhere today",
    "I feel numb and hollow after what happened",
  ],
  funny: [
    "Today was absolutely hilarious I can't stop laughing",
    "Something ridiculous happened and I lost it completely",
    "I need something funny to cheer me up",
    "That was so absurd and silly I couldn't help laughing",
    "Everything today was chaotic but in a funny way",
    "I want to laugh and forget about everything",
    "I'm in the mood for something light and amusing",
    "I had the most bizarre funny day imaginable",
    "I need a good laugh after everything today",
    "Something weird happened and now I can't stop giggling",
    "It was so ridiculous I couldn't be mad about it",
    "I laughed until I cried today",
  ],
  awkward: [
    "I said something so embarrassing I want to disappear",
    "The most cringe worthy thing happened to me today",
    "I completely froze and made everything so uncomfortable",
    "I overshared with someone I barely know and now I regret it",
    "I want the ground to swallow me whole after today",
    "I made it so weird between us and I can't take it back",
    "I bumped into my ex and handled it terribly",
    "I said the wrong thing at the worst possible moment",
    "Everything I did today was mortifying and awkward",
    "I could have died from embarrassment today",
    "I accidentally made things so uncomfortable for everyone",
    "I stuttered and rambled and it was a disaster",
  ],
  bittersweet: [
    "I feel happy and sad at the same time and I don't know why",
    "Something good ended today and I have mixed feelings about it",
    "I feel nostalgic and reflective about how things used to be",
    "It was a good day but something about it made me melancholy",
    "I'm proud but also grieving what I'm leaving behind",
    "Everything is changing and I don't know how to feel",
    "I feel wistful thinking about the past and what could have been",
    "Today was bittersweet in a way I can't quite explain",
    "I'm moving on but I'm not sure I wanted to",
    "I feel like I'm at the end of something important",
    "Good things are happening but I feel strangely sad",
    "I'm conflicted between being happy and being heartbroken",
  ],
  flirty: [
    "I can't stop thinking about someone and it's driving me crazy",
    "There's someone I really like and my heart races around them",
    "We had this electric moment and I can't get it out of my head",
    "I think they might like me back and I'm so nervous",
    "My crush smiled at me today and I completely melted",
    "I have butterflies every time I think about them",
    "Something romantic happened and I'm floating on air",
    "I think I'm falling for someone and it's terrifying",
    "We almost kissed and now I can't think straight",
    "I'm completely swooning over someone right now",
    "There's this undeniable chemistry between us",
    "I got a text from them and my heart skipped a beat",
  ],
  heartfelt: [
    "Someone did something so kind for me today and I'm moved",
    "I feel genuinely loved and appreciated right now",
    "A small moment today reminded me that things will be okay",
    "I felt truly seen and understood by someone today",
    "Something beautiful happened that restored my faith in people",
    "I'm overwhelmed with gratitude for the people in my life",
    "Someone checked in on me and it meant everything",
    "I feel warm and hopeful after a really tender moment",
    "Something simple made my whole day today",
    "I feel deeply connected and less alone right now",
    "An unexpected act of kindness completely moved me",
    "I'm proud of myself for how I handled things today",
  ],
  shocking: [
    "I found out something that completely blindsided me",
    "I never saw that coming and my whole world shifted",
    "Someone revealed something that turned everything upside down",
    "I was completely betrayed and I don't know what to think",
    "The news came out of nowhere and I'm still in shock",
    "I discovered something today that changed everything",
    "My jaw dropped and I couldn't believe what I was hearing",
    "I'm speechless after what just happened",
    "Everything I thought I knew turned out to be wrong",
    "The twist came out of nowhere and I'm still reeling",
    "I found out a secret that I can't unsee",
    "Something happened that I genuinely did not see coming",
  ],
  grief: [
    "I'm still not over losing them and some days are harder",
    "Grief hits me in waves and today was a bad wave",
    "I saw something that reminded me of them and fell apart",
    "I'm carrying this sadness everywhere I go",
    "The loss still feels fresh even though it's been a while",
    "I thought I was healing but today set me back",
    "I miss them in a way that doesn't go away",
    "The absence of someone feels overwhelming today",
    "I'm trying to process a loss that feels too big",
    "I keep reaching for my phone to call someone who isn't there",
    "Their memory hit me out of nowhere today",
    "I'm grieving something I can't quite name",
  ],
  tender: [
    "I feel soft and quiet today like the world is gentle",
    "Something small and sweet happened and it moved me deeply",
    "I feel a quiet warmth that I can't fully explain",
    "Today was gentle and slow and I needed that",
    "I feel delicate and a little vulnerable but okay",
    "Something tender happened between me and someone I love",
    "I feel emotionally open in a way that surprised me",
    "A quiet moment today felt more meaningful than anything loud",
    "I feel like I need something soft and gentle right now",
    "Today had a sweetness to it I want to hold onto",
    "I feel like being still and sitting with my feelings",
    "Something small cracked me open in the best way",
  ],
  devastating: [
    "Everything fell apart today and I don't know how to recover",
    "Something happened that I'm not sure I can come back from",
    "The worst possible thing happened and I'm just trying to breathe",
    "I feel like the floor disappeared from under me",
    "Today was catastrophic and I'm barely holding on",
    "I'm in complete freefall and nothing feels real",
    "Something ended today that I don't think I'll get over",
    "I feel completely destroyed by what happened",
    "The news today was the worst I could have imagined",
    "I don't know who I am after what just happened",
    "I feel like I lost everything in one moment",
    "Today broke something in me that I'm not sure can be fixed",
  ],
};

const episodes = [
  { id: "S1E1", label: "S1E1 – Pilot", moods: ["funny", "awkward"] },
  { id: "S1E2", label: "S1E2 – Episode 2", moods: ["awkward", "funny", "grief"] },
  { id: "S1E3", label: "S1E3 – Episode 3", moods: ["funny", "bittersweet"] },
  { id: "S1E4", label: "S1E4 – Episode 4", moods: ["bittersweet", "heartfelt", "tender"] },
  { id: "S1E5", label: "S1E5 – Episode 5", moods: ["bittersweet", "awkward", "grief"] },
  { id: "S1E6", label: "S1E6 – Season 1 Finale", moods: ["cry", "grief", "shocking", "devastating"] },
  { id: "S2E1", label: "S2E1 – Episode 1", moods: ["cry", "grief", "heartfelt"] },
  { id: "S2E2", label: "S2E2 – Episode 2", moods: ["funny", "flirty", "awkward"] },
  { id: "S2E3", label: "S2E3 – Episode 3", moods: ["funny", "flirty", "heartfelt", "bittersweet"] },
  { id: "S2E4", label: "S2E4 – Episode 4", moods: ["cry", "grief", "bittersweet"] },
  { id: "S2E5", label: "S2E5 – Episode 5", moods: ["funny", "awkward", "heartfelt", "tender"] },
  { id: "S2E6", label: "S2E6 – Season 2 Finale", moods: ["shocking", "flirty", "cry", "bittersweet", "devastating"] },
];

const moodColors = {
  cry: "#7c9cbf", funny: "#c9a84c", awkward: "#b07a6e",
  bittersweet: "#9b7eb8", flirty: "#c4617a", heartfelt: "#7ab87a",
  shocking: "#bf7a3a", grief: "#6a7a8a", tender: "#c4a882",
  devastating: "#8a6a8a",
};

const moodEmoji = {
  cry: "💧", funny: "😏", awkward: "😬", bittersweet: "🥀",
  flirty: "💌", heartfelt: "🌿", shocking: "😶", grief: "🌧️",
  tender: "🕯️", devastating: "🖤",
};

const moodMessages = {
  cry:         "You're in that soft, bruised place right now. Fleabag knows this one intimately.",
  funny:       "You need something that gets it — funny because it's painfully, perfectly true.",
  awkward:     "You've survived something mortifying today. You deserve an episode that validates every cringeworthy second.",
  bittersweet: "Somewhere between okay and not okay. That's the most Fleabag place to be.",
  flirty:      "Someone is living completely rent-free in your head. Completely relatable.",
  heartfelt:   "Something cracked you open in the best way today. Hold onto that feeling.",
  shocking:    "The rug has been pulled and you're still mid-air. You need chaos that matches yours.",
  grief:       "Grief doesn't follow a schedule. Fleabag understands that better than anyone.",
  tender:      "You're feeling soft and open today. The world owes you something gentle.",
  devastating: "You're still breathing. That's enough for now. Fleabag survived the unsurvivable too.",
};

// ─── ML HELPERS ───────────────────────────────────────────────────────────────

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function classifyMood(model, userText, moodEmbeddings) {
  const inputEmbedding = await model.embed([userText]);
  const inputVec = (await inputEmbedding.array())[0];
  inputEmbedding.dispose();

  const scores = {};
  for (const [mood, embeddings] of Object.entries(moodEmbeddings)) {
    const similarities = embeddings.map(emb => cosineSimilarity(inputVec, emb));
    const top3 = similarities.sort((a, b) => b - a).slice(0, 3);
    scores[mood] = top3.reduce((sum, v) => sum + v, 0) / top3.length;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topMoods = sorted.filter(([, s]) => s > 0.35).slice(0, 3).map(([m]) => m);
  return { topMoods, scores };
}

function findBestScene(topMoods) {
  // Score each scene by how many of its moods match the user's top moods
  // Priority given to scenes matching the PRIMARY mood
  const scored = scenes.map(scene => {
    const primaryMatch = scene.moods.includes(topMoods[0]) ? 3 : 0;
    const otherMatches = scene.moods.filter(m => topMoods.slice(1).includes(m)).length;
    return { scene, score: primaryMatch + otherMatches };
  }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

  return scored.length > 0 ? scored[0].scene : null;
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [modelState, setModelState] = useState("loading");
  const [input, setInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [animateIn, setAnimateIn] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const modelRef = useRef(null);
  const moodEmbeddingsRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      setModelState("loading");
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress(p => Math.min(p + Math.random() * 10, 88));
      }, 300);

      const model = await use.load();
      modelRef.current = model;

      const moodEmbeddings = {};
      for (const [mood, examples] of Object.entries(moodExamples)) {
        const embeddings = await model.embed(examples);
        moodEmbeddings[mood] = await embeddings.array();
        embeddings.dispose();
      }
      moodEmbeddingsRef.current = moodEmbeddings;

      clearInterval(interval);
      setLoadingProgress(100);
      setTimeout(() => setModelState("ready"), 500);
    } catch (e) {
      console.error(e);
      setModelState("error");
    }
  };

  const analyze = async () => {
    if (!input.trim() || input.trim().split(" ").length < 3) {
      setError("Tell me a little more — even just a few sentences.");
      return;
    }
    setAnalyzing(true);
    setResult(null);
    setError("");

    try {
      const { topMoods, scores } = await classifyMood(
        modelRef.current, input, moodEmbeddingsRef.current
      );

      if (topMoods.length === 0) {
        setError("Couldn't quite read that. Try describing how you feel, not just what happened.");
        setAnalyzing(false);
        return;
      }

      const matchedEpisodes = episodes
        .filter(ep => ep.moods.some(m => topMoods.includes(m)))
        .map(ep => ({
          ...ep,
          matchScore:
            ep.moods.filter(m => topMoods.includes(m)).length +
            topMoods.reduce((sum, mood, i) =>
              ep.moods.includes(mood) ? sum + scores[mood] * (3 - i) : sum, 0),
        }))
        .sort((a, b) => b.matchScore - a.matchScore);

      const maxScore = Math.max(...Object.values(scores));
      const normalisedScores = Object.fromEntries(
        Object.entries(scores).map(([m, s]) => [m, Math.round((s / maxScore) * 100)])
      );

      const matchedScene = findBestScene(topMoods);

      setResult({
        topMoods,
        scores: normalisedScores,
        message: moodMessages[topMoods[0]],
        scene: matchedScene,
        episodes: matchedEpisodes,
      });
    } catch (e) {
      setError("Something went wrong. Try again.");
    }
    setAnalyzing(false);
  };

  const reset = () => { setResult(null); setInput(""); setError(""); };

  // ── LOADING ──
  if (modelState === "loading") {
    return (
      <div className="bg">
        <div className={`container ${animateIn ? "visible" : ""}`}>
          <div className="header">
            <div className="eyebrow">a mood-matching tool for</div>
            <h1 className="title">FLEABAG</h1>
            <div className="divider" />
          </div>
          <div className="loading-wrap">
            <div className="section-label">loading intelligence</div>
            <div className="loading-track">
              <div className="loading-bar" style={{ width: `${loadingProgress}%` }} />
            </div>
            <p className="loading-subtext">
              downloading a machine learning model into your browser.<br />
              this only happens once — it will be instant next time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── ERROR ──
  if (modelState === "error") {
    return (
      <div className="bg">
        <div className="container visible">
          <h1 className="title">FLEABAG</h1>
          <p className="error-msg" style={{ marginTop: "32px" }}>
            Failed to load. Check your internet and try again.
          </p>
          <button onClick={loadModel} className="btn" style={{ marginTop: "20px" }}>
            try again
          </button>
        </div>
      </div>
    );
  }

  // ── MAIN ──
  return (
    <div className="bg">
      <div className={`container ${animateIn ? "visible" : ""}`}>

        <div className="header">
          <div className="eyebrow">a mood-matching tool for</div>
          <h1 className="title">FLEABAG</h1>
          <p className="subtitle">Tell me about your day. I'll find your scene.</p>
          <div className="divider" />
        </div>

        {!result && (
          <div className="input-section">
            <textarea
              className="fleabag-textarea"
              placeholder={`So... it's been a day.\n\nTell me everything. The meeting that went wrong, the text you didn't send, the moment you almost cried in the bathroom, the thing that made you laugh despite everything...`}
              value={input}
              onChange={e => { setInput(e.target.value); setError(""); }}
              onKeyDown={e => { if (e.key === "Enter" && e.metaKey) analyze(); }}
              rows={7}
            />
            {error && <div className="error-msg">{error}</div>}
            <div className="hint">Be honest. The more you share, the smarter the match.</div>
            <button
              onClick={analyze}
              disabled={analyzing || !input.trim()}
              className="btn"
            >
              {analyzing
                ? <span>reading your soul<span className="dots">...</span></span>
                : "find my scene →"}
            </button>
          </div>
        )}

        {result && (
          <div className="result-fade-in">

            {/* PWB-style message */}
            <div className="message-card">
              <div className="quote-icon">"</div>
              <p className="message">{result.message}</p>
            </div>

            {/* THE SCENE */}
            {result.scene && (
              <div className="scene-card">
                <div className="scene-header">
                  <div className="scene-label">✦ your scene</div>
                  <div className="scene-episode-tag">{result.scene.episode}</div>
                </div>
                <div className="scene-title">{result.scene.title}</div>
                <p className="scene-description">{result.scene.description}</p>
                <div className="scene-resonance">
                  <strong>why it's yours right now —</strong> {result.scene.resonance}
                </div>
              </div>
            )}

            {/* Mood score bars */}
            <div className="section-label">what the model detected</div>
            <div className="bars-section">
              {Object.entries(result.scores)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([mood, pct]) => (
                  <div key={mood} className="bar-row">
                    <div className="bar-mood-label">{moodEmoji[mood]} {mood}</div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${pct}%`, background: moodColors[mood] || "#888" }}
                      />
                    </div>
                    <div className="bar-pct">{pct}%</div>
                  </div>
                ))}
            </div>

            {/* Mood tags */}
            <div className="mood-row">
              {result.topMoods.map(mood => (
                <span
                  key={mood}
                  className="mood-tag"
                  style={{ background: moodColors[mood] || "#666" }}
                >
                  {moodEmoji[mood]} {mood}
                </span>
              ))}
            </div>

            {/* Episode list */}
            <div className="section-label">watch these episodes</div>
            <div className="episode-list">
              {result.episodes.length > 0 ? result.episodes.map((ep, i) => (
                <div key={ep.id} className={`ep-card ${i === 0 ? "top" : ""}`}>
                  {i === 0 && <div className="best-match">best match</div>}
                  <div className="ep-row">
                    <div>
                      <div className="ep-id">{ep.id}</div>
                      <div className="ep-name">{ep.label.split("–")[1]?.trim()}</div>
                    </div>
                    <div className="ep-dots">
                      {ep.moods.filter(m => result.topMoods.includes(m)).map(m => (
                        <span
                          key={m}
                          className="dot"
                          style={{ background: moodColors[m] || "#888" }}
                          title={m}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="ep-match-moods">
                    {ep.moods.filter(m => result.topMoods.includes(m)).join(" · ")}
                  </div>
                </div>
              )) : (
                <p className="no-match">Honestly? Watch all of it from the beginning.</p>
              )}
            </div>

            <button onClick={reset} className="btn-reset">← analyse another day</button>
          </div>
        )}

        <div className="footer">
          powered by tensorflow.js · universal sentence encoder · no data leaves your browser
        </div>
      </div>
    </div>
  );
}