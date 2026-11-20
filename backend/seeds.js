
import "dotenv/config";
import mongoose from "mongoose";

import Skill from "./models/Skill.js";
import Project from "./models/Project.js";
import Profile from "./models/Profile.js";
import Contact from "./models/Contact.js";

const skills = [
  { name: "HTML5", category: "Frontend", icon: "Code2", level: 95, featured: true, order: 1 },
  { name: "CSS3", category: "Frontend", icon: "Palette", level: 92, featured: true, order: 2 },
  { name: "JavaScript", category: "Programming", icon: "Code", level: 90, featured: true, order: 3 },
  { name: "React.js", category: "Frontend", icon: "Atom", level: 88, featured: true, order: 4 },
  { name: "Node.js", category: "Backend", icon: "Server", level: 85, featured: true, order: 5 },
  { name: "Express.js", category: "Backend", icon: "Layers", level: 85, featured: true, order: 6 },
  { name: "MongoDB", category: "Database", icon: "Database", level: 85, featured: true, order: 7 },
  { name: "Mongoose", category: "Database", icon: "Database", level: 82, featured: false, order: 8 },
  { name: "Python", category: "Programming", icon: "Code", level: 75, featured: false, order: 9 },
  { name: "Git & GitHub", category: "Tools", icon: "GitBranch", level: 85, featured: true, order: 10 },
  { name: "REST APIs", category: "Backend", icon: "Globe", level: 85, featured: true, order: 11 },
  { name: "Bootstrap", category: "Frontend", icon: "Layout", level: 80, featured: false, order: 12 },
  { name: "Tailwind CSS", category: "Frontend", icon: "Palette", level: 82, featured: false, order: 13 },
  { name: "Postman", category: "Tools", icon: "Send", level: 80, featured: false, order: 14 },
  { name: "VS Code", category: "Tools", icon: "Code", level: 90, featured: false, order: 15 },
  { name: "C++", category: "Programming", icon: "Code", level: 70, featured: false, order: 16 },
];

const projects = [
  {
    title: "Kabeer Library",
    slug: "kabeer-library",
    description:
      "A digital book management platform with user authentication, premium book access, Razorpay payments, content management and an admin dashboard.",
    technologies: ["React", "Node.js", "Express.js", "MongoDB", "Razorpay"],
    liveUrl: "",
    githubUrl: "https://github.com/kabeerul-ali",
    category: "MERN Stack",
    featured: true,
    status: "published",
    order: 1,
  },
  {
    title: "Explore Universe",
    slug: "explore-universe",
    description:
      "An astronomy exploration website featuring NASA APOD data, space images and an interactive image discovery experience.",
    technologies: ["HTML", "CSS", "JavaScript", "NASA API"],
    liveUrl: "https://exploreuniversebykabeer.netlify.app",
    githubUrl: "https://github.com/kabeerul-ali",
    category: "Web Development",
    featured: true,
    status: "published",
    order: 2,
  },
  {
    title: "MERN SaaS",
    slug: "mern-saas",
    description:
      "A full-stack SaaS application concept with a modern interface, backend APIs and scalable application architecture.",
    technologies: ["React", "Node.js", "Express.js", "MongoDB"],
    liveUrl: "",
    githubUrl: "https://github.com/kabeerul-ali",
    category: "MERN Stack",
    featured: true,
    status: "published",
    order: 3,
  },
  {
    title: "Weather Forecasting",
    slug: "weather-forecasting",
    description:
      "A responsive weather application that displays weather conditions and forecast information using a weather API.",
    technologies: ["React", "CSS", "JavaScript", "Weather API"],
    liveUrl: "",
    githubUrl: "https://github.com/kabeerul-ali",
    category: "Web Development",
    featured: false,
    status: "published",
    order: 4,
  },
  {
    title: "Currency Converter",
    slug: "currency-converter",
    description:
      "A currency conversion application that helps users convert currencies using exchange rate data.",
    technologies: ["HTML", "CSS", "JavaScript", "Exchange API"],
    liveUrl: "",
    githubUrl: "https://github.com/kabeerul-ali",
    category: "Web Development",
    featured: false,
    status: "published",
    order: 5,
  },
  {
    title: "Kabeer Blog",
    slug: "kabeer-blog",
    description:
      "A blogging platform concept for creating, publishing and managing articles through a modern web interface.",
    technologies: ["React", "Node.js", "Express.js", "MongoDB"],
    liveUrl: "",
    githubUrl: "https://github.com/kabeerul-ali",
    category: "MERN Stack",
    featured: false,
    status: "published",
    order: 6,
  },
];

const profile = {
  name: "Kabeerul Ali",
  designation: "Full Stack MERN Developer",
  tagline: "Building Digital Experiences That Matter.",
  bio: "I'm a Full Stack MERN Developer passionate about building modern web applications and solving real-world problems. I work with React, Node.js, Express and MongoDB to turn ideas into useful digital products. I also have experience with HTML, CSS, JavaScript, API integration and responsive web development.",
  profileImage: "",
  email: "hello@example.com",
  phone: "",
  location: "India",
  resumeUrl: "",
  socialLinks: {
    github: "https://github.com/kabeerul-ali",
    linkedin: "https://www.linkedin.com/",
    twitter: "https://x.com/Kabeerulali",
    portfolio: "https://exploreuniversebykabeer.netlify.app",
  },
};

const contacts = [
  {
    email: "rahul@example.com",
    messages: [
      {
        name: "Rahul Sharma",
        phone: "9000000001",
        message: "Hi Kabeer, I checked your portfolio. I would like to discuss a website development project.",
        createdAt: new Date("2026-11-15T10:30:00"),
      },
      {
        name: "Rahul Sharma",
        phone: "9000000001",
        message: "Let me know when you are available for a quick discussion.",
        createdAt: new Date("2026-11-16T12:15:00"),
      },
    ],
  },
  {
    email: "priya@example.com",
    messages: [
      {
        name: "Priya Verma",
        phone: "9000000002",
        message: "Hello, I am interested in collaborating on a React project.",
        createdAt: new Date("2026-11-17T09:45:00"),
      },
    ],
  },
  {
    email: "amit@example.com",
    messages: [
      {
        name: "Amit Kumar",
        phone: "9000000003",
        message: "Your projects look interesting. Can you share your development services and availability?",
        createdAt: new Date("2026-11-18T14:20:00"),
      },
    ],
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI or MONGODB_URI is missing in .env");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");

    // Seed skills without creating duplicates
    for (const skill of skills) {
      await Skill.updateOne(
        { name: skill.name },
        { $set: skill },
        { upsert: true }
      );
    }

    console.log(`${skills.length} skills seeded`);

    // Seed projects using unique slugs
    for (const project of projects) {
      await Project.updateOne(
        { slug: project.slug },
        { $set: project },
        { upsert: true }
      );
    }

    console.log(`${projects.length} projects seeded`);

    // Keep one profile document
    await Profile.findOneAndUpdate(
      {},
      { $set: profile },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log("Profile seeded successfully");

    // Seed contact records with sample message arrays
    for (const contact of contacts) {
      await Contact.updateOne(
        { email: contact.email },
        { $set: { messages: contact.messages } },
        { upsert: true }
      );
    }

    console.log(`${contacts.length} contact records seeded`);

    console.log("\nDatabase seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
