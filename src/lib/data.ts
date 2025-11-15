export type Campaign = {
  id: string;
  title: string;
  description: string;
  goal: number;
  currentAmount: number;
  creatorName: string;
  creatorAvatarId: string;
  campaignImageId: string;
  category: string;
};

export const campaigns: Campaign[] = [
  {
    id: "help-build-our-community-garden",
    title: "Help Build Our Community Garden",
    description: "We're raising funds to transform a neglected urban space into a vibrant community garden. Your donation will help us buy soil, seeds, tools, and build raised beds for everyone to enjoy fresh, locally-grown produce.",
    goal: 5000,
    currentAmount: 2850,
    creatorName: "Maria Sanchez",
    creatorAvatarId: "avatar-1",
    campaignImageId: "campaign-community-garden",
    category: "Community"
  },
  {
    id: "the-aurora-mural-project",
    title: "The Aurora Mural Project",
    description: "Support local artists in creating a massive public mural that celebrates our city's history and diversity. Funds will cover paint, supplies, artist stipends, and a public unveiling event.",
    goal: 8000,
    currentAmount: 7500,
    creatorName: "Ben Carter",
    creatorAvatarId: "avatar-2",
    campaignImageId: "campaign-art-mural",
    category: "Arts"
  },
  {
    id: "paws-for-a-cause-shelter-expansion",
    title: "Paws for a Cause: Shelter Expansion",
    description: "Our animal shelter is overflowing. We need your help to expand our facilities, providing more space, better medical care, and a safe haven for homeless animals until they find their forever homes.",
    goal: 25000,
    currentAmount: 11200,
    creatorName: "Emily Chen",
    creatorAvatarId: "avatar-3",
    campaignImageId: "campaign-animal-shelter",
    category: "Animals"
  },
  {
    id: "code-connect-next-gen-edtech",
    title: "CodeConnect: Next-Gen EdTech",
    description: "We are developing a free, open-source platform to make learning to code accessible and fun for everyone, regardless of their background. Your support will help us finalize development and launch our beta version.",
    goal: 15000,
    currentAmount: 4500,
    creatorName: "David Lee",
    creatorAvatarId: "avatar-4",
    campaignImageId: "campaign-tech-startup",
    category: "Technology"
  },
  {
    id: "echoes-of-yesterday-a-short-film",
    title: "'Echoes of Yesterday' - A Short Film",
    description: "Help us bring a powerful historical drama to life. 'Echoes of Yesterday' tells the story of a forgotten hero. Funds are needed for production costs, including location permits, costumes, and equipment rental.",
    goal: 12000,
    currentAmount: 9800,
    creatorName: "Sophia Rodriguez",
    creatorAvatarId: "avatar-5",
    campaignImageId: "campaign-short-film",
    category: "Film"
  },
  {
    id: "coding-cubs-free-workshops-for-kids",
    title: "Coding Cubs: Free Workshops for Kids",
    description: "Let's empower the next generation of innovators! We're running free coding workshops for underprivileged children in our community. Donations will provide laptops, learning materials, and snacks for our young learners.",
    goal: 7500,
    currentAmount: 7450,
    creatorName: "Tech For All Org",
    creatorAvatarId: "avatar-6",
    campaignImageId: "campaign-kids-coding",
    category: "Education"
  },
];
