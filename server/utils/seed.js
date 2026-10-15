import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';

dotenv.config();

const usersData = [
  {
    name: 'Alex Rivera',
    email: 'alex@example.com',
    password: 'Password123!',
    bio: 'Senior Full-Stack Architect passionate about scalable web systems, React patterns, and clean code principles.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sophia Chen',
    email: 'sophia@example.com',
    password: 'Password123!',
    bio: 'Product Designer and Design Systems enthusiast. Obsessed with micro-interactions, typography, and accessibility.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Marcus Vance',
    email: 'marcus@example.com',
    password: 'Password123!',
    bio: 'Backend Specialist & Cloud Enthusiast. Writing about distributed databases, caching patterns, and Node.js performance.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog_platform';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing collections
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});
    console.log('[Seed] Cleared existing data');

    // Create users (they will be hashed by User pre-save hook)
    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`[Seed] Created ${createdUsers.length} users`);

    const postsData = [
      {
        title: 'Mastering Full-Stack Architecture in Modern Web Applications',
        content: `Building scalable full-stack applications requires careful consideration of both front-end ergonomics and back-end resilience. In this comprehensive guide, we explore how decoupled micro-frontends and robust REST APIs harmonize to deliver sub-second response times.

### 1. The Power of Separation of Concerns
When designing a MERN stack platform, separating your domain models, business logic controllers, and routing allows your team to iterate rapidly without risking regression.

### 2. State Management Strategies
Managing asynchronous state effectively on the client is critical. By pairing Context API with clean custom hooks, we maintain clean separation without unnecessary external dependencies.

### 3. Conclusion
Architecting modern web apps is an iterative journey. Always prioritize developer velocity alongside runtime performance.`,
        category: 'Web Development',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80',
        author: createdUsers[0]._id,
        readTime: '4 min read',
      },
      {
        title: 'Crafting Minimalist & Accessible Design Systems for 2026',
        content: `Design systems are the living foundation of any modern digital product. When done right, they create cohesive user experiences, empower engineering teams, and dramatically accelerate feature development.

### The Philosophy of Restraint
Minimalism in interface design is not merely about using lots of white space; it is about reducing cognitive overhead so the user's focus effortlessly flows to the primary action.

### Key Tenets:
- **Typography as Hierarchy:** Use contrasting weights and clean sans-serif typefaces to guide the eye.
- **Purposeful Color Palettes:** A crisp neutral palette anchored by vibrant primary blue accents (#2563eb).
- **Subtle Elevation:** Soft, diffuse drop shadows that give cards tactile depth without harsh borders.

Design is not just what it looks like and feels like. Design is how it works.`,
        category: 'Design',
        imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80',
        author: createdUsers[1]._id,
        readTime: '3 min read',
      },
      {
        title: 'Optimizing MongoDB Performance and Indexing Strategies',
        content: `As your data footprint grows, queries that once took milliseconds can quietly degrade into database bottlenecks. Understanding compound indexing, projection, and the aggregation pipeline is essential.

### Single-Field vs Compound Indexes
When filtering on multiple fields—such as searching published posts by category and sorting by creation date—a compound index like \`{ category: 1, createdAt: -1 }\` eliminates in-memory sorting.

### Virtuals and Aggregation
Leveraging MongoDB's \`$lookup\` and \`$group\` pipelines allows us to compute metrics like comment counts dynamically while maintaining fast query times.`,
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80',
        author: createdUsers[2]._id,
        readTime: '5 min read',
      },
      {
        title: 'The Art of Writing Clean, Maintainable React Code',
        content: `React continues to evolve, yet the core principles of writing clean components remain timeless. Let's delve into component composition, custom hook encapsulation, and performance optimization techniques.

### Why Custom Hooks Matter
Abstracting repetitive logic—such as fetching, pagination, and form handling—into custom hooks keeps your UI components declarative and concise.

### Defensive Rendering
Handling edge cases like loading skeletons, empty search states, and error alerts upfront makes your app feel instantly polished and resilient.`,
        category: 'Tutorials',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
        author: createdUsers[0]._id,
        readTime: '4 min read',
      },
      {
        title: 'Navigating Tech Careers: From Junior Developer to Staff Engineer',
        content: `The journey from writing your first line of code to leading architectural initiatives across multiple teams is rarely linear. It demands a balanced blend of deep technical mastery and high-impact communication.

### Cultivating High Agency
The most impactful engineers don't wait for detailed specs. They seek out problems, talk to stakeholders, write clear technical proposals, and deliver solutions incrementally.

### Mentorship as a Superpower
As you grow, your multiplier effect becomes your primary metric. Helping junior peers debug complex problems and reviewing pull requests thoughtfully accelerates the entire engineering organization.`,
        category: 'Career',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
        author: createdUsers[1]._id,
        readTime: '6 min read',
      },
      {
        title: 'Next-Generation API Security with JWT and Token Rotation',
        content: `Securing modern web applications requires a defense-in-depth approach. JSON Web Tokens (JWT) offer lightweight, stateless authorization, but they must be implemented with rigor.

### Token Expiration and Secrets
Never hardcode secrets. Always use cryptographically secure random strings stored in environment variables, and enforce reasonable token expiration periods alongside HTTPS transport.

### Proper Authorization Guards
Always verify resource ownership on the server side. Never trust client-provided IDs blindly without validating that the authenticated user actually owns the record being modified.`,
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&auto=format&fit=crop&q=80',
        author: createdUsers[2]._id,
        readTime: '4 min read',
      },
    ];

    const createdPosts = await Post.insertMany(postsData);
    console.log(`[Seed] Created ${createdPosts.length} posts`);

    // Add comments
    const commentsData = [
      {
        content: 'Exceptional overview! The separation of concerns point resonates strongly with our current architecture upgrade.',
        post: createdPosts[0]._id,
        author: createdUsers[1]._id,
      },
      {
        content: 'Completely agree. Custom hooks make React codebases an absolute joy to maintain.',
        post: createdPosts[0]._id,
        author: createdUsers[2]._id,
      },
      {
        content: 'The color palette recommendation is spot-on. Minimalist design with intentional blue accents creates unmatched readability.',
        post: createdPosts[1]._id,
        author: createdUsers[0]._id,
      },
      {
        content: 'Compound indexes saved our production system during last month’s traffic surge! Essential reading for any backend dev.',
        post: createdPosts[2]._id,
        author: createdUsers[0]._id,
      },
      {
        content: 'Mentorship and high agency are truly the defining traits of senior technical leadership.',
        post: createdPosts[4]._id,
        author: createdUsers[2]._id,
      },
    ];

    await Comment.insertMany(commentsData);
    console.log(`[Seed] Created ${commentsData.length} comments`);

    console.log('[Seed] Database successfully populated!');
    console.log('\nDemo User Logins:');
    console.log('1) alex@example.com / Password123!');
    console.log('2) sophia@example.com / Password123!');
    console.log('3) marcus@example.com / Password123!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDB();
