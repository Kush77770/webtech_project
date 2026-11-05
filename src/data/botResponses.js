// AI-style bot response system
const responses = {
  greetings: {
    patterns: ['hello', 'hi', 'hey', 'howdy', 'sup', 'what\'s up', 'whats up', 'hola', 'namaste', 'greetings'],
    replies: [
      "Hey there! Great to hear from you 😊 How's your day going?",
      "Hi! How are you doing today? 🌟",
      "Hello! Always good to chat with you. What's on your mind?",
      "Hey! 👋 Hope you're having a wonderful day!",
      "Hi there! What can I help you with today? 😄",
      "Heyyy! Long time! What's new with you? 🙌",
    ],
  },
  howAreYou: {
    patterns: ['how are you', 'how r u', 'how do you do', 'how\'s it going', 'hows it going', 'you okay', 'you good', 'all good'],
    replies: [
      "I'm doing absolutely fantastic, thanks for asking! What about you? 😊",
      "Great as always! Life's good 🌈 How about yourself?",
      "Couldn't be better! Loving every moment. You? 🎉",
      "Really well, thanks! Always happy to chat with you 😄",
      "All good! Living the dream 🚀 How are things with you?",
    ],
  },
  thanks: {
    patterns: ['thank', 'thanks', 'thx', 'ty', 'thank you', 'appreciate', 'grateful'],
    replies: [
      "You're very welcome! Happy to help anytime 😊",
      "Of course! That's what friends are for! 🤝",
      "No problem at all! Anytime you need anything, just say the word.",
      "Always happy to help! 🙌",
      "Don't mention it! You'd do the same for me 😄",
    ],
  },
  bye: {
    patterns: ['bye', 'goodbye', 'see you', 'see ya', 'later', 'cya', 'take care', 'gotta go', 'ttyl', 'catch you later'],
    replies: [
      "Bye! Take care and stay awesome! 👋",
      "See you later! Have an amazing day! 🌟",
      "Goodbye! It was great talking to you 😊",
      "Take care! Talk soon 💬",
      "Catch you later! Don't be a stranger 👋",
    ],
  },
  help: {
    patterns: ['help', 'assist', 'support', 'problem', 'issue', 'stuck', 'confused', 'don\'t understand', 'how to', 'what is', 'what are', 'explain'],
    replies: [
      "Of course I'm here to help! Tell me more about what's going on 🔍",
      "Sure thing! What do you need help with? I'll do my best 💪",
      "I've got you! What's the problem? Let's figure it out together 🧩",
      "Happy to assist! Give me more details and we'll sort it out 🛠️",
      "Let's tackle this together! What are you stuck on? 🤔",
    ],
  },
  lol: {
    patterns: ['lol', 'lmao', 'haha', 'hehe', 'funny', 'hilarious', '😂', '🤣', 'laugh', 'joke'],
    replies: [
      "Haha! Right?! 😂 That's too funny!",
      "Lmao! 😄 You always make me laugh!",
      "Hahaha! Can't stop laughing at that 🤣",
      "That's hilarious! 😂😂",
      "Stop it, you're killing me! 😂",
    ],
  },
  love: {
    patterns: ['love', 'miss', 'crush', 'like you', 'feelings', 'heart', '❤️', '💕', '😍'],
    replies: [
      "Aww, that's so sweet! 🥰",
      "You're making me blush! 😊💕",
      "That's really touching to hear ❤️",
      "Awww! You're too kind 🌸",
      "That means so much! 💕",
    ],
  },
  food: {
    patterns: ['food', 'eat', 'hungry', 'lunch', 'dinner', 'breakfast', 'snack', 'cook', 'recipe', 'restaurant', 'pizza', 'burger', 'coffee'],
    replies: [
      "Ooh, food talk! My favorite topic 😍 What are you craving?",
      "I'm always up for food conversations! What are you eating? 🍕",
      "Yes! Food is life! 🍜 What are you thinking of having?",
      "Now I'm hungry too! 😄 What's for today?",
      "Food is basically my love language 😂 Tell me more!",
    ],
  },
  work: {
    patterns: ['work', 'job', 'office', 'meeting', 'project', 'boss', 'colleague', 'deadline', 'task', 'assignment'],
    replies: [
      "Work life balance is so important! How's it going at the office? 💼",
      "Deadlines can be stressful! Hope everything works out 💪",
      "Work hustle! Keep going, you've got this! 🚀",
      "Ugh, work stuff. Hope it's not too overwhelming! What's happening?",
      "The grind continues! What's keeping you busy? 📋",
    ],
  },
  weather: {
    patterns: ['weather', 'rain', 'sunny', 'cold', 'hot', 'temperature', 'cloudy', 'storm', 'snow'],
    replies: [
      "Weather talk! Is it nice where you are? ☀️",
      "The weather has been crazy lately! What's it like there? 🌤️",
      "I hope you're staying warm and cozy! 🌧️",
      "Perfect weather for staying in and chatting! ☕",
      "Nature always has a way of keeping things interesting 🌈",
    ],
  },
  movies: {
    patterns: ['movie', 'film', 'series', 'show', 'watch', 'netflix', 'cinema', 'episode', 'season', 'actor', 'actress'],
    replies: [
      "Oh nice! What are you watching? 🎬",
      "I love a good movie recommendation! What is it? 🍿",
      "Cinema nights are the best! What's the show/movie? 📺",
      "Ooh tell me more! Is it good? 🎥",
      "Nothing beats a good binge session! 😄 What are you into?",
    ],
  },
  music: {
    patterns: ['music', 'song', 'artist', 'album', 'playlist', 'concert', 'sing', 'listen', 'spotify', 'band'],
    replies: [
      "Music lover! What are you listening to? 🎵",
      "Good music makes everything better! What's the vibe? 🎶",
      "Ooh, share your playlist! Always looking for new songs 🎸",
      "Music is the universal language! What genre? 🎵",
      "Nothing like a good tune to lift the mood! 🎤",
    ],
  },
  travel: {
    patterns: ['travel', 'trip', 'vacation', 'holiday', 'flight', 'hotel', 'explore', 'journey', 'destination', 'visit'],
    replies: [
      "Travel goals! Where are you off to? ✈️",
      "Adventure awaits! What's the plan? 🗺️",
      "I love hearing about travel plans! Tell me everything 🌍",
      "Wanderlust mode activated! Where to next? 🧳",
      "Travel is the best investment! Where are you going? ✈️",
    ],
  },
  good: {
    patterns: ['good', 'great', 'amazing', 'awesome', 'fantastic', 'wonderful', 'excellent', 'perfect', 'nice', 'cool', 'super'],
    replies: [
      "That's amazing to hear! 🎉 Tell me more!",
      "So glad things are going well! 😊",
      "That's wonderful! Keep up the good vibes! ✨",
      "Love the positivity! 🌟 What's got you in such a great mood?",
      "Yay! Good news always makes my day 😄",
    ],
  },
  bad: {
    patterns: ['bad', 'sad', 'depressed', 'anxious', 'worried', 'stressed', 'tired', 'exhausted', 'not good', 'awful', 'terrible', 'horrible'],
    replies: [
      "I'm sorry to hear that 💙 Want to talk about it?",
      "Aww, that sucks. I'm here if you need to vent 🫂",
      "Hope things get better soon. You've got this 💪",
      "Sending good vibes your way! 🌟 What's going on?",
      "That sounds tough. Remember it's okay to take it one step at a time 🤍",
    ],
  },
  study: {
    patterns: ['study', 'exam', 'test', 'college', 'university', 'school', 'homework', 'assignment', 'class', 'lecture', 'grade'],
    replies: [
      "Study mode! You've got this 📚 How's it going?",
      "Exams can be stressful but you'll ace it! 💪",
      "College life is an adventure! What subject? 🎓",
      "Study tip: take breaks every 45 mins, it really helps! ☕",
      "You're putting in the work and that matters! Keep going 🌟",
    ],
  },
  ai: {
    patterns: ['ai', 'artificial intelligence', 'machine learning', 'chatbot', 'robot', 'gpt', 'openai'],
    replies: [
      "AI is such an exciting field! Are you working on something with it? 🤖",
      "The future is AI! What's your take on it? 🚀",
      "AI is moving so fast these days! It's both exciting and a bit scary 😄",
      "Love talking AI! What aspect are you interested in? 💻",
      "We're living in the future! AI is everywhere now 🤖✨",
    ],
  },
};

const fallbackReplies = [
  "Interesting! Tell me more about that 😊",
  "That's a good point! What do you think about it?",
  "Really? I'd love to hear more 🤔",
  "Hmm, that's something to think about! 💭",
  "I see! How's that working out for you?",
  "That's pretty cool! What else is new? 😄",
  "Ah got it! Anything else on your mind?",
  "Makes sense! You always have interesting things to say 😊",
  "Oh wow, didn't expect that! Tell me more 👀",
  "That's quite something! What happens next?",
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getBotResponse = (message) => {
  const lowerMsg = message.toLowerCase().trim();

  for (const category of Object.values(responses)) {
    const matched = category.patterns.some((p) => lowerMsg.includes(p));
    if (matched) {
      return getRandomItem(category.replies);
    }
  }

  return getRandomItem(fallbackReplies);
};

export const getTypingDelay = () => Math.floor(Math.random() * 2000) + 1000; // 1–3 seconds
