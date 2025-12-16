import Blog from "@/components/blogs-component";

const blogCards = [
  {
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/blog/image-21.png",
    alt: "Aerial view of ocean and boat",
    date: "20 JULY 2022",
    title: "Destination Highlights: Discover Your Next Adventure",
    author: "Nolan Carder",
    authorImg: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
    role: "SEO Lead",
    blogLink: "#",
    authorProfileLink: "#",
  },
  {
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/blog/image-22.png",
    alt: "Mountain landscape",
    date: "02 FEB 2021",
    title:
      "Travel Tips & Guides: Expert Advice for Your Journeys and Adventures",
    author: "Zaire Vetrovs",
    authorImg: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
    role: "Designer",
    blogLink: "#",
    authorProfileLink: "#",
  },
  {
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/blog/image-20.png",
    alt: "Tropical beach",
    date: "15 OCT 2024",
    title: "Travel Trends and Insights: What's New in the World of Travel",
    author: "Anika Franci",
    authorImg: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
    role: "CTO",
    blogLink: "#",
    authorProfileLink: "#",
  },
  {
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/blog/image-19.png",
    alt: "Santorini blue domes",
    date: "11 NOV 2023",
    title: "Insider Reviews: Top Hotels, Tours, Destinations and Attractions",
    author: "Phillip George",
    authorImg: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
    role: "Content Writer",
    blogLink: "#",
    authorProfileLink: "#",
  },
];

const BlogPage = () => {
  return <Blog blogCards={blogCards} />;
};

export default BlogPage;
