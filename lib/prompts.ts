import type { DrawingPrompt } from "./types";

export const warmUpPrompts: DrawingPrompt[] = [
  // Whimsical characters
  { text: "A villain who is actually harmless", emoji: "😈" },
  { text: "A superhero with a completely useless power", emoji: "🦸" },
  { text: "A dragon who is afraid of butterflies", emoji: "🐉" },
  { text: "A cat in a job interview", emoji: "🐱" },
  { text: "A robot learning to paint", emoji: "🤖" },
  { text: "A ghost who is terrible at haunting", emoji: "👻" },
  { text: "A pirate who gets seasick", emoji: "🏴‍☠️" },
  { text: "A knight whose armor is made of cardboard", emoji: "🛡️" },
  { text: "A witch who only uses her powers for cooking", emoji: "🧙‍♀️" },
  { text: "A detective who can only solve very obvious mysteries", emoji: "🔍" },
  { text: "A mermaid in the desert", emoji: "🧜‍♀️" },
  { text: "A giant who is afraid of mice", emoji: "🧌" },
  { text: "A fairy godmother on her day off", emoji: "🧚" },
  { text: "An alien visiting Earth for the first time", emoji: "👽" },
  { text: "A zombie who just wants to garden", emoji: "🧟" },
  { text: "A vampire at the beach", emoji: "🧛" },
  { text: "A yeti applying sunscreen", emoji: "❄️" },
  { text: "A centaur trying to ride a bicycle", emoji: "🚲" },
  { text: "A time traveler who keeps arriving five minutes late", emoji: "⏰" },
  { text: "A librarian who fights crime at night", emoji: "📚" },

  // Animals being people
  { text: "A fish out of water, literally", emoji: "🐟" },
  { text: "Two animals having a disagreement", emoji: "🐻" },
  { text: "A bird who collects strange things", emoji: "🐦" },
  { text: "A tiny creature with a very big job", emoji: "🐜" },
  { text: "An octopus trying to type on a keyboard", emoji: "🐙" },
  { text: "A penguin giving a TED talk", emoji: "🐧" },
  { text: "A sloth running a marathon", emoji: "🦥" },
  { text: "A group of mice planning a heist", emoji: "🐭" },
  { text: "An owl who is a morning person", emoji: "🦉" },
  { text: "A dog who has their own dog", emoji: "🐕" },
  { text: "A frog prince who prefers being a frog", emoji: "🐸" },
  { text: "A snake trying to wear a hat", emoji: "🐍" },
  { text: "A bear who runs a bed and breakfast", emoji: "🐻" },
  { text: "Raccoons in a trench coat pretending to be human", emoji: "🦝" },
  { text: "A hedgehog at a balloon party", emoji: "🦔" },

  // Food & objects as characters
  { text: "Your favorite food as a person", emoji: "🍕" },
  { text: "The world's most complicated sandwich", emoji: "🥪" },
  { text: "A teapot having an existential crisis", emoji: "🫖" },
  { text: "A lamp that is jealous of the sun", emoji: "💡" },
  { text: "A fork and spoon on a first date", emoji: "🍴" },
  { text: "A brave little toaster on an adventure", emoji: "🍞" },
  { text: "A cactus who just wants a hug", emoji: "🌵" },
  { text: "An umbrella on a sunny day", emoji: "☂️" },
  { text: "A clock that is always running behind", emoji: "🕰️" },
  { text: "A book that is bored of its own story", emoji: "📖" },

  // Places & environments
  { text: "A house where a wizard lives", emoji: "🏠" },
  { text: "The view from the tallest building in an imaginary city", emoji: "🏙️" },
  { text: "The coziest room you can imagine", emoji: "🛋️" },
  { text: "What the inside of a cloud looks like", emoji: "☁️" },
  { text: "A treehouse for an introvert", emoji: "🌳" },
  { text: "An underwater post office", emoji: "📬" },
  { text: "A restaurant on the moon", emoji: "🌙" },
  { text: "The last bookshop on Earth", emoji: "📕" },
  { text: "A garden growing on top of a skyscraper", emoji: "🌿" },
  { text: "A secret room behind a waterfall", emoji: "🌊" },
  { text: "A bus stop at the edge of the world", emoji: "🚏" },
  { text: "A cozy cabin in the middle of a storm", emoji: "🏚️" },
  { text: "The messiest art studio in the world", emoji: "🎨" },
  { text: "A library that goes on forever", emoji: "🏛️" },
  { text: "A city built entirely on bridges", emoji: "🌉" },

  // Emotions & abstract concepts
  { text: "What Monday morning looks like", emoji: "😴" },
  { text: "What music looks like when you close your eyes", emoji: "🎵" },
  { text: "The feeling of forgetting something important", emoji: "😰" },
  { text: "What a sneeze would look like if it were a creature", emoji: "🤧" },
  { text: "Draw the sound of thunder", emoji: "⛈️" },
  { text: "What does patience look like as a landscape?", emoji: "🏔️" },
  { text: "The taste of your favorite song", emoji: "🎶" },
  { text: "What boredom looks like in physical form", emoji: "😶" },
  { text: "The last dream you remember", emoji: "💭" },
  { text: "What happiness smells like", emoji: "🌸" },

  // Creative constraints
  { text: "A self-portrait using only triangles", emoji: "🔺" },
  { text: "Draw something using only curved lines", emoji: "〰️" },
  { text: "A landscape using only three colors", emoji: "🎨" },
  { text: "Draw the person next to you as a cartoon character", emoji: "✏️" },
  { text: "A portrait using only straight lines", emoji: "📏" },
  { text: "Draw with your non-dominant hand: a house", emoji: "🏡" },
  { text: "A face made entirely of food", emoji: "🍉" },
  { text: "A single continuous line drawing of an animal", emoji: "🖊️" },
  { text: "Draw something that starts with the first letter of your name", emoji: "🔤" },
  { text: "Fill the page with as many eyes as possible", emoji: "👁️" },

  // Everyday life, but weird
  { text: "Someone holding something way too heavy", emoji: "🏋️" },
  { text: "Someone discovering something unexpected in their pocket", emoji: "🧥" },
  { text: "A plant that has feelings", emoji: "🌱" },
  { text: "The worst haircut in history", emoji: "💇" },
  { text: "A really bad day told in four panels", emoji: "📋" },
  { text: "Someone trying to walk a very stubborn dog", emoji: "🐕‍🦺" },
  { text: "The most over-the-top cup of coffee ever made", emoji: "☕" },
  { text: "A person whose shadow does its own thing", emoji: "🌑" },
  { text: "What your phone sees when you drop it", emoji: "📱" },
  { text: "A very dramatic sneeze", emoji: "💨" },

  // Inventions & contraptions
  { text: "A Rube Goldberg machine that makes breakfast", emoji: "🥞" },
  { text: "A vehicle that should not work but somehow does", emoji: "🚗" },
  { text: "The world's worst invention", emoji: "🔧" },
  { text: "A machine that converts sadness into candy", emoji: "🍬" },
  { text: "A hat with way too many features", emoji: "🎩" },
  { text: "Shoes designed for walking on clouds", emoji: "👟" },
  { text: "A house that can pick up and move", emoji: "🏘️" },
  { text: "A backpack with infinite pockets", emoji: "🎒" },
  { text: "The world's most impractical chair", emoji: "🪑" },
  { text: "A telescope that shows the past instead of the stars", emoji: "🔭" },

  // Mashups & twists
  { text: "Combine two animals into one new creature", emoji: "🧬" },
  { text: "A historical figure doing something mundane", emoji: "👑" },
  { text: "A medieval knight using modern technology", emoji: "⚔️" },
  { text: "A dinosaur in a modern-day grocery store", emoji: "🦕" },
  { text: "A fairy tale scene set in outer space", emoji: "🚀" },
  { text: "A famous painting but everything is cats", emoji: "🖼️" },
  { text: "A mythical creature working a 9-to-5 job", emoji: "🧜" },
  { text: "A snowman in a tropical paradise", emoji: "⛄" },
  { text: "A superhero whose costume was designed by a toddler", emoji: "👶" },
  { text: "A still life but all the objects are alive", emoji: "🍎" },

  // Nature & wonder
  { text: "A tree that grows something other than fruit", emoji: "🌲" },
  { text: "The bottom of the ocean at night", emoji: "🌊" },
  { text: "A sunset on a planet with three suns", emoji: "🌅" },
  { text: "A flower that only blooms during thunderstorms", emoji: "🌺" },
  { text: "What the wind looks like if you could see it", emoji: "🍃" },
];

export function shufflePrompts(): number[] {
  const indices = warmUpPrompts.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}
