// Sample photos are remote Unsplash placeholders, not licensed assets.
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80`;

export type Slide = {
  photo: string;
  location: string;
  title: string;
  body: string;
};

export const slides: Slide[] = [
  {
    photo: unsplash("1542718610-a1d656d1884c"),
    location: "Whistler, BC",
    title: "Find a stay that fits your story",
    body: "From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip.",
  },
  {
    photo: unsplash("1520250497591-112f2f40a3f4"),
    location: "Krabi, Thailand",
    title: "Just say what you're looking for",
    body: "Describe your trip in one sentence and get stays ranked for you.",
  },
  {
    photo: unsplash("1499793983690-e29da59ef1c2"),
    location: "Maldives",
    title: "Answers straight from the source",
    body: "Ask about check-in, pets or cancellations and see the stay's own policy, word for word.",
  },
];
