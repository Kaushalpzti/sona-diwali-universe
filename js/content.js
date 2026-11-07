/*
  SONA'S DIWALI UNIVERSE - PERSONALISATION & CONTENT
  Fully customizable romantic & festive Diwali universe for Sona & Kaushal.
*/
window.SONA_CONTENT = {
  name: "Sona",
  nickname: "Buchua",
  from: "Kaushal",
  secretPassword: "BUCHUA", // Alternate accepted: "SONA"
  startDate: "2025-05-05T00:00:00", // The first hello
  officialDate: "2025-06-28T00:00:00", // When it became official
  
  audioTracks: [
    { title: "Romantic Lofi Dreams ✨", file: "assets/audio/romantic-instrumental.mp3" },
    { title: "Gentle Piano Melody 🎹", file: "assets/audio/piano-melody.mp3" },
    { title: "Harp & Starlight 🌙", file: "assets/audio/harp-dream.mp3" }
  ],

  finalLetterTitle: "My favourite light",
  finalLetter: `My Sona,\n\nHappy Diwali, Buchua. 💗\n\nI wanted to give you something a little different this year — something you could explore, play with, laugh at and keep as a tiny forever memory. So I built this little universe for you. Every diya, every star and every silly game has one simple thought behind it: I hope you keep smiling.\n\nFrom our first hello on 5 May 2025 to the day our little story became official on 28 June 2025, you have become such an irreplaceable part of my world. I may not always have the perfect words, but I will always have an infinite number of reasons to love you and wish you happiness.\n\nMay this Diwali bring you peace when days feel heavy, courage when things feel difficult, and a thousand reasons to smile. Wherever life takes us, I want to keep collecting little moments with you.\n\nYou are my favourite reason to believe in magic.\n\nHappy Diwali, my Sona. Keep shining brighter than every star tonight.\n\nForever yours,\n{{from}} ♡`,

  // Photo corner with fallback SVGs & support for user uploads
  photos: [
    { file: "01-first-hello.jpg", svgFallback: "01-first-hello.svg", title: "The First Hello", caption: "One little hello on 05 May 2025 turned into our forever story.", date: "05 May 2025" },
    { file: "02-favourite-selfie.jpg", svgFallback: "02-favourite-selfie.svg", title: "My Favourite View", caption: "That precious smile of yours that effortlessly steals my breath away.", date: "Every Single Day" },
    { file: "03-silly-moment.jpg", svgFallback: "03-silly-moment.svg", title: "Our Silly Side", caption: "The crazy laughs, teasing each other, and all our goofy conversations.", date: "Best Laughs" },
    { file: "04-special-day.jpg", svgFallback: "04-special-day.svg", title: "A Day To Keep", caption: "28 June 2025 — when two souls said yes to a million memories.", date: "28 June 2025" },
    { file: "05-us-together.jpg", svgFallback: "05-us-together.svg", title: "Side By Side", caption: "Every sunset is warmer, and every festival shines brighter with you.", date: "Our Journey" },
    { file: "06-another-memory.jpg", svgFallback: "06-another-memory.svg", title: "Forever & Always", caption: "The best chapters of our life are still being written, hand in hand.", date: "To Infinity" }
  ],

  // 5 Ceremony Diyas to light
  diyas: [
    { id: "diya-love", name: "Diya of Eternal Love", hindi: "शाश्वत प्रेम का दीया", message: "May the love between us keep glowing warmer and brighter with every passing second." },
    { id: "diya-smile", name: "Diya of Sona's Smile", hindi: "मुस्कान का दीया", message: "May your sweet smile never fade, Buchua. It is the prettiest light in this world." },
    { id: "diya-peace", name: "Diya of Peace & Health", hindi: "सुख और शांति का दीया", message: "May you always be blessed with good health, gentle thoughts, and pure serenity." },
    { id: "diya-dreams", name: "Diya of Big Dreams", hindi: "उमंग और सपनों का दीया", message: "May every brave dream in your little heart find wings to soar this year." },
    { id: "diya-together", name: "Diya of Our Togetherness", hindi: "हमेशा के साथ का दीया", message: "Here's to us, our silly banter, our tight hugs, and our beautiful little forever." }
  ],

  // Redeemable Love Coupons
  coupons: [
    {
      id: "coupon-hug",
      title: "One Giant Warm Hug",
      icon: "🫂",
      tag: "VALID ANYTIME",
      desc: "Redeemable for one ultra-tight, warm, non-let-go hug whenever you feel low or need warmth.",
      finePrint: "No expiry date • Valid 24/7 across all distances • Guaranteed to melt worries away"
    },
    {
      id: "coupon-maggi",
      title: "Late Night Date / Maggi",
      icon: "🍜",
      tag: "MY TREAT",
      desc: "Redeemable for a cozy food treat of your choice, made with extra love and zero complaints.",
      finePrint: "Includes favorite snacks, sweet desserts, and unlimited chatting time"
    },
    {
      id: "coupon-win",
      title: "Pass To Win Any Argument",
      icon: "👑",
      tag: "ULTIMATE PASS",
      desc: "Show this coupon to instantly win any friendly fight or argument. Sona is always right!",
      finePrint: "Kaushal agrees to say 'You were right, Buchua' without making excuses!"
    },
    {
      id: "coupon-compliment",
      title: "10-Minute Compliment Storm",
      icon: "💖",
      tag: "PURE LOVE",
      desc: "Redeemable for 10 minutes of non-stop honest compliments celebrating how truly wonderful you are.",
      finePrint: "Side effects include uncontrollable blushing, cute smiles, and feeling like a queen"
    }
  ],

  letters: [
    {
      id: "miss",
      title: "Open when you miss me",
      icon: "♡",
      teaser: "For the quiet distance between two hugs.",
      body: "Close your eyes for a second, Buchua. Imagine me sitting right beside you, stealing a smile and gently holding your hand.\n\nDistance can keep our hands apart for a moment, but it cannot stop my heart from constantly whispering how much you mean to me. Whenever you feel alone, remember that somewhere out there, a boy is always thinking of you and smiling at your pictures.\n\nSending you the warmest, biggest virtual hug right now. 💗"
    },
    {
      id: "sad",
      title: "Open when you're sad",
      icon: "☁",
      teaser: "A soft reminder for a heavy day.",
      body: "Hey, my Sona. Take a deep, gentle breath.\n\nYou don't have to carry the whole world on your shoulders every single second. It's okay to feel overwhelmed, it's okay to cry, and it's okay to have days where you just want to rest.\n\nOne difficult day does not define your story. You are stronger, braver, and far more loved than your doubts will ever tell you. Drink a little water, wrap yourself in a blanket, and let me be your safe corner. I believe in you, always. ♡"
    },
    {
      id: "hug",
      title: "Open when you need a hug",
      icon: "🤍",
      teaser: "No explanation needed. Just a warm hug.",
      body: "Arms wrapped tight around you. One soft forehead kiss. A quiet little whisper: 'I'm here, you're safe.'\n\nThat's the hug I am sending your way right this moment. Don't rush out of it. Just stay in this moment for ten seconds and let the universe feel a little softer. You are cherished, Buchua. 🤍"
    },
    {
      id: "smile",
      title: "Open when you need a smile",
      icon: "☀",
      teaser: "A tiny delivery of happy thoughts.",
      body: "OFFICIAL NOTICE FROM KAUSHAL'S HEART:\n\n1. You are ridiculously cute.\n2. Your smile deserves an international award.\n3. Seeing you happy instantly fixes my worst days.\n\nNow, look in the mirror or look at this screen, curve those lips, and show me that trademark Buchua smile. Yes, that exact one! Never lose it. 😚✨"
    },
    {
      id: "special",
      title: "Open when you feel special",
      icon: "✧",
      teaser: "Because you truly, truly are.",
      body: "You do not need a festival, a grand occasion, or anyone's approval to be special. You already are extraordinary, just by being you.\n\nThe way you care, the little nuances of your personality, the brightness in your eyes — everything about you makes this universe a much sweeter place to live in. Never doubt your worth, Sona. You are pure magic. 💗"
    }
  ],

  quiz: [
    {
      question: "When did our little story first begin with a sweet hello?",
      choices: ["5 May 2025", "28 June 2025", "15 August 2025", "14 February 2025"],
      answer: 0,
      note: "5 May 2025 — The very first page of our forever story! ♡"
    },
    {
      question: "On which date did we make our relationship official?",
      choices: ["5 May 2025", "28 June 2025", "31 December 2025", "11 November 2025"],
      answer: 1,
      note: "28 June 2025 — The best day of my life, my favourite yes! 💗"
    },
    {
      question: "What is one thing Kaushal will never get tired of?",
      choices: ["Eating cold pizza", "Watching your cute smile", "Sleeping through alarms", "Cleaning his desk"],
      answer: 1,
      note: "Your smile is my absolute favourite thing in this entire universe! ✨"
    },
    {
      question: "What is Sona's secret superpower?",
      choices: ["Making Kaushal blush instantly", "Being impossibly cute", "Lighting up every room she enters", "All of the above!"],
      answer: 3,
      note: "All of the above! You are 100% pure magic, Buchua. 😚"
    },
    {
      question: "Who was this entire Diwali universe coded and designed for?",
      choices: ["NASA scientists", "Alien neighbours", "My one and only Sona", "Google robots"],
      answer: 2,
      note: "Obviously for you, my Sona! Every single pixel is filled with love! 💖"
    }
  ],

  scratchMessages: [
    "If I could send one thing through this screen right now, it would be a warm hug and a gentle forehead kiss. Happy Diwali, Sona! 💗",
    "Your smile is my favourite Diwali light. No cracker in the sky compares to the spark in your eyes, Buchua! ✨",
    "A tiny secret reminder: You are deeply loved, endlessly appreciated, and forever cherished by Kaushal. Always. ♡",
    "May our love grow as deep as the night sky and as bright as thousands of glowing diyas! 🪔"
  ],

  giftMessages: [
    { title: "One Unlimited Lifetime Hug 🤗", body: "Redeemable anytime, anywhere. No distance fees. Valid across all lifetimes!" },
    { title: "A Thousand Forehead Kisses 😚", body: "Delivered virtually today with pure warmth, ready for physical delivery soon!" },
    { title: "A Secret Golden Wish 🌟", body: "May every hidden wish in your heart find its path to coming true this Diwali." },
    { title: "Your Personal Forever Cheerleader 📣", body: "You take on whatever comes your way. I will always be right here, cheering for you!" }
  ],

  wheelPrizes: [
    "One Giant Warm Hug 🫂",
    "A Sweet Forehead Kiss 😚",
    "A Heartfelt Romantic Compliment 💖",
    "A Late-Night Voice Note 🎙️",
    "Unlimited Smiles Guarantee 😊",
    "A Handwritten Love Letter 💌",
    "One Free Silly Joke 🤪",
    "A Special Diwali Wish 🪔"
  ],

  hiddenHeartMessages: [
    "You found the first little heart! (Just like how you stole my heart!) ♡",
    "Second heart found! One more reason to smile today. 🌸",
    "Third heart found! You are so good at this, Buchua! ✨",
    "Fourth heart unlocked! Almost there, my love! 🏮",
    "All five hearts collected! You found all the hidden treasures of my heart! 💗"
  ],

  wishes: [
    "May your heart always feel safe, warm, and deeply cherished.",
    "May every new morning bring a brand new reason for you to smile effortlessly.",
    "May your dreams grow bigger than your fears, and your courage shine like gold.",
    "May peace surround your mind whenever the world feels a little too loud.",
    "And my sweetest little wish? A lifetime full of Diwali memories with you, Sona. ♡"
  ],

  // Cute fortune cookie compliments
  fortunes: [
    "Your laugh is Kaushal's favorite melody in the universe.",
    "You look breathtaking today (and yesterday, and tomorrow too).",
    "Someone is thinking about you right now with a huge silly smile.",
    "The stars in the sky are jealous of the spark in your eyes.",
    "You deserve all the sweetest desserts and the biggest hugs in the world.",
    "Even on your messiest days, you are impossibly lovable.",
    "The world became infinitely prettier on the day you were born.",
    "Every love song suddenly makes sense when I look at you."
  ]
};
