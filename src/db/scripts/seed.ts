#!/usr/bin/env node

import pg from "pg";
import initDotEnv from "./env";

initDotEnv();

const seed = async () => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Do not use in production");
  }
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }
  const client = new pg.Client({
    connectionString: process.env.POSTGRES_URL,
  });

  console.log("⏳ Checking connexion ...");
  console.log(`🗄️  URL : ${process.env.POSTGRES_URL}`);

  await client.connect();

  const start = Date.now();

  console.log("🌱 Starting seed...");

  // Password hash
  const passwordHash =
    "49d4324d4de4ce4496f8d8ade01be96c:0ce091180e0602a8c03ceccbc321c2abf82f2e15234e98fbde0caae1eb7e24fbfeb5994ad1257df19fa0d7cca1a95bf994d15fbaa37e028a0082cf8c1bdb60f1";

  // Create users
  console.log("👤 Creating users...");
  const users = await client.query(`
    INSERT INTO "user" (id, name, email, email_verified, image, created_at, updated_at)
    VALUES
      ('user_1', 'Thomas Loyan', 'thomas@example.com', true, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas', NOW(), NOW()),
      ('user_2', 'Jane Doe', 'jane@example.com', true, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane', NOW(), NOW()),
      ('user_3', 'John Smith', 'john@example.com', false, 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', NOW(), NOW())
    ON CONFLICT (email) DO NOTHING
    RETURNING id;
  `);

  // Create accounts with password for each user
  console.log("🔑 Creating accounts with passwords...");
  await client.query(`
    INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
    VALUES
      (gen_random_uuid()::text, 'user_1', 'credential', 'user_1', '${passwordHash}', NOW(), NOW()),
      (gen_random_uuid()::text, 'user_2', 'credential', 'user_2', '${passwordHash}', NOW(), NOW()),
      (gen_random_uuid()::text, 'user_3', 'credential', 'user_3', '${passwordHash}', NOW(), NOW())
    ON CONFLICT DO NOTHING;
  `);

  // Create tags
  console.log("🏷️  Creating tags...");
  await client.query(`
    INSERT INTO tags (id, label, value)
    VALUES
      (gen_random_uuid(), 'JavaScript', 'javascript'),
      (gen_random_uuid(), 'TypeScript', 'typescript'),
      (gen_random_uuid(), 'React', 'react'),
      (gen_random_uuid(), 'Next.js', 'nextjs'),
      (gen_random_uuid(), 'Node.js', 'nodejs'),
      (gen_random_uuid(), 'Database', 'database'),
      (gen_random_uuid(), 'DevOps', 'devops'),
      (gen_random_uuid(), 'Web Development', 'web-dev'),
      (gen_random_uuid(), 'Tutorial', 'tutorial'),
      (gen_random_uuid(), 'Best Practices', 'best-practices')
    ON CONFLICT DO NOTHING;
  `);

  // Get tag IDs for later use
  const tagsResult = await client.query(`SELECT id, value FROM tags`);
  const tagMap = new Map(
    tagsResult.rows.map((row: { id: string; value: string }) => [
      row.value,
      row.id,
    ])
  );

  // Create articles with rich Tiptap content
  console.log("📝 Creating articles...");

  const article1Content = JSON.stringify({
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Getting Started with Next.js 15" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Next.js 15 brings exciting new features and improvements that make building modern web applications easier than ever. In this comprehensive guide, we'll explore the key features and how to leverage them in your projects.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "What's New in Next.js 15?" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Next.js 15 introduces several groundbreaking features:",
          },
        ],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Turbopack Stable:",
                  },
                  {
                    type: "text",
                    text: " The new bundler is now production-ready and significantly faster than Webpack",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Partial Prerendering:",
                  },
                  {
                    type: "text",
                    text: " Combine static and dynamic rendering in a single route",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Enhanced Caching:",
                  },
                  {
                    type: "text",
                    text: " More granular control over caching strategies",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Getting Started" }],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "To create a new Next.js 15 project, run:" },
        ],
      },
      {
        type: "codeBlock",
        attrs: { language: "bash" },
        content: [
          {
            type: "text",
            text: "npx create-next-app@latest my-app\ncd my-app\nnpm run dev",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This will set up a new project with all the latest features enabled by default.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Server Components Best Practices" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Here's an example of a Server Component that fetches data:",
          },
        ],
      },
      {
        type: "codeBlock",
        attrs: { language: "typescript" },
        content: [
          {
            type: "text",
            text: "async function BlogPost({ params }: { params: { id: string } }) {\n  const post = await fetch(\`https://api.example.com/posts/\${params.id}\`, {\n    next: { revalidate: 3600 }\n  })\n  \n  return <article>{post.title}</article>\n}",
          },
        ],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "italic" }],
                text: "Pro tip: Use Server Components by default and only reach for Client Components when you need interactivity.",
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "With these powerful features, Next.js 15 continues to be the premier framework for building production-ready React applications.",
          },
        ],
      },
    ],
  });

  const article2Content = JSON.stringify({
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "TypeScript Best Practices in 2025" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "TypeScript has evolved significantly over the years, and 2025 brings new patterns and practices for writing maintainable, type-safe code. Let's explore the modern approaches that will make you a more effective TypeScript developer.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "1. Embrace Template Literal Types" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Template literal types allow you to create powerful, type-safe APIs:",
          },
        ],
      },
      {
        type: "codeBlock",
        attrs: { language: "typescript" },
        content: [
          {
            type: "text",
            text: "type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';\ntype Endpoint = '/users' | '/posts' | '/comments';\ntype Route = \`\${HTTPMethod} \${Endpoint}\`;\n\n// Type is: 'GET /users' | 'POST /users' | ... etc\nfunction apiCall(route: Route) { }",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "2. Use Const Assertions" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Const assertions provide the most specific type inference:",
          },
        ],
      },
      {
        type: "codeBlock",
        attrs: { language: "typescript" },
        content: [
          {
            type: "text",
            text: "const config = {\n  endpoint: 'https://api.example.com',\n  timeout: 5000,\n  retries: 3\n} as const;\n\n// Type is { readonly endpoint: \"https://api.example.com\"; ... }",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [
          {
            type: "text",
            text: "3. Discriminated Unions for State Management",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Model your application state with discriminated unions:",
          },
        ],
      },
      {
        type: "codeBlock",
        attrs: { language: "typescript" },
        content: [
          {
            type: "text",
            text: "type LoadingState = { status: 'loading' };\ntype SuccessState = { status: 'success'; data: string[] };\ntype ErrorState = { status: 'error'; error: Error };\n\ntype State = LoadingState | SuccessState | ErrorState;\n\nfunction render(state: State) {\n  switch (state.status) {\n    case 'loading':\n      return 'Loading...';\n    case 'success':\n      return state.data.join(', '); // TypeScript knows data exists!\n    case 'error':\n      return state.error.message; // TypeScript knows error exists!\n  }\n}",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Key Takeaways" }],
      },
      {
        type: "orderedList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Use template literal types for type-safe string manipulation",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Leverage const assertions for precise type inference",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Model complex states with discriminated unions",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Enable strict mode and embrace type safety",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", marks: [{ type: "bold" }], text: "Remember:" },
          {
            type: "text",
            text: " The goal is not to fight with TypeScript, but to let it guide you toward better code design.",
          },
        ],
      },
    ],
  });

  const article3Content = JSON.stringify({
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Building a Blog with Drizzle ORM" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Drizzle ORM is a lightweight, TypeScript-first ORM that provides excellent developer experience and type safety. In this guide, we'll build a complete blog system with PostgreSQL and Drizzle.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Why Drizzle ORM?" }],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Type-safe:",
                  },
                  {
                    type: "text",
                    text: " End-to-end type safety from database to application",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Lightweight:",
                  },
                  { type: "text", text: " Minimal runtime overhead" },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "SQL-like:",
                  },
                  { type: "text", text: " Familiar syntax for SQL developers" },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Migration support:",
                  },
                  { type: "text", text: " Built-in schema migration tools" },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Setting Up the Schema" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "First, let's define our database schema for articles and tags:",
          },
        ],
      },
      {
        type: "codeBlock",
        attrs: { language: "typescript" },
        content: [
          {
            type: "text",
            text: "import { pgTable, text, integer, boolean, json } from 'drizzle-orm/pg-core';\n\nexport const articles = pgTable('article', {\n  id: integer().primaryKey().generatedByDefaultAsIdentity(),\n  title: text(),\n  excerpt: text(),\n  content: json(),\n  image: text(),\n  published: boolean().$default(() => false),\n  authorId: text('author_id').references(() => user.id),\n});\n\nexport const tags = pgTable('tags', {\n  id: uuid().primaryKey().defaultRandom(),\n  label: text(),\n  value: text(),\n});",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Querying Data" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Drizzle provides a clean, type-safe API for queries:",
          },
        ],
      },
      {
        type: "codeBlock",
        attrs: { language: "typescript" },
        content: [
          {
            type: "text",
            text: "import { db } from './db';\nimport { articles, tags } from './schema';\nimport { eq } from 'drizzle-orm';\n\n// Get all published articles\nconst published = await db\n  .select()\n  .from(articles)\n  .where(eq(articles.published, true));\n\n// Get article with tags\nconst articleWithTags = await db\n  .select()\n  .from(articles)\n  .leftJoin(articlesToTags, eq(articles.id, articlesToTags.articleId))\n  .leftJoin(tags, eq(articlesToTags.tagId, tags.id));",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Running Migrations" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Keep your database in sync with your schema:",
          },
        ],
      },
      {
        type: "codeBlock",
        attrs: { language: "bash" },
        content: [
          {
            type: "text",
            text: "# Generate migration\nnpx drizzle-kit generate\n\n# Apply migration\nnpx drizzle-kit migrate",
          },
        ],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: "💡 " },
              { type: "text", marks: [{ type: "bold" }], text: "Tip:" },
              {
                type: "text",
                text: " Use Drizzle Studio to visualize and manage your database with a beautiful UI.",
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Drizzle ORM strikes the perfect balance between type safety and developer experience, making it an excellent choice for modern TypeScript applications.",
          },
        ],
      },
    ],
  });

  const article4Content = JSON.stringify({
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Authentication with Better Auth" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Implementing secure authentication in your Next.js application doesn't have to be complicated. Better Auth provides a modern, type-safe approach to authentication that integrates seamlessly with your stack.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Why Better Auth?" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Better Auth stands out from other authentication solutions:",
          },
        ],
      },
      // {
      //   type: "table",
      //   content: [
      //     {
      //       type: "tableRow",
      //       content: [
      //         {
      //           type: "tableHeader",
      //           content: [
      //             {
      //               type: "paragraph",
      //               content: [{ type: "text", marks: [{ type: "bold" }], text: "Feature" }]
      //             }
      //           ]
      //         },
      //         {
      //           type: "tableHeader",
      //           content: [
      //             {
      //               type: "paragraph",
      //               content: [{ type: "text", marks: [{ type: "bold" }], text: "Better Auth" }]
      //             }
      //           ]
      //         },
      //         {
      //           type: "tableHeader",
      //           content: [
      //             {
      //               type: "paragraph",
      //               content: [{ type: "text", marks: [{ type: "bold" }], text: "Others" }]
      //             }
      //           ]
      //         }
      //       ]
      //     },
      //     {
      //       type: "tableRow",
      //       content: [
      //         {
      //           type: "tableCell",
      //           content: [
      //             {
      //               type: "paragraph",
      //               content: [{ type: "text", text: "Type Safety" }]
      //             }
      //           ]
      //         },
      //         {
      //           type: "tableCell",
      //           content: [
      //             {
      //               type: "paragraph",
      //               content: [{ type: "text", text: "✅ Full" }]
      //             }
      //           ]
      //         },
      //         {
      //           type: "tableCell",
      //           content: [
      //             {
      //               type: "paragraph",
      //               content: [{ type: "text", text: "❌ Partial" }]
      //             }
      //           ]
      //         }
      //       ]
      //     },
      //     {
      //       type: "tableRow",
      //       content: [
      //         {
      //           type: "tableCell",
      //           content: [
      //             {
      //               type: "paragraph",
      //               content: [{ type: "text", text: "Setup Time" }]
      //             }
      //           ]
      //         },
      //         {
      //           type: "tableCell",
      //           content: [
      //             {
      //               type: "paragraph",
      //               content: [{ type: "text", text: "⚡ 5 minutes" }]
      //             }
      //           ]
      //         },
      //         {
      //           type: "tableCell",
      //           content: [
      //             {
      //               type: "paragraph",
      //               content: [{ type: "text", text: "🐌 30+ minutes" }]
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   ]
      // },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Quick Setup" }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Install Better Auth:" }],
      },
      {
        type: "codeBlock",
        attrs: { language: "bash" },
        content: [{ type: "text", text: "npm install better-auth" }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Configure your auth instance:" }],
      },
      {
        type: "codeBlock",
        attrs: { language: "typescript" },
        content: [
          {
            type: "text",
            text: "import { betterAuth } from 'better-auth';\nimport { drizzleAdapter } from 'better-auth/adapters/drizzle';\n\nexport const auth = betterAuth({\n  database: drizzleAdapter(db, {\n    provider: 'pg',\n  }),\n  emailAndPassword: {\n    enabled: true,\n  },\n  socialProviders: {\n    github: {\n      clientId: process.env.GITHUB_CLIENT_ID!,\n      clientSecret: process.env.GITHUB_CLIENT_SECRET!,\n    },\n  },\n});",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Protecting Routes" }],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Use middleware to protect your routes:" },
        ],
      },
      {
        type: "codeBlock",
        attrs: { language: "typescript" },
        content: [
          {
            type: "text",
            text: "import { auth } from './auth';\n\nexport default auth.middleware({\n  protected: ['/dashboard', '/profile'],\n  public: ['/login', '/register'],\n});",
          },
        ],
      },
      {
        type: "horizontalRule",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [{ type: "bold" }],
            text: "Security Best Practices:",
          },
        ],
      },
      {
        type: "orderedList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Always use HTTPS in production" },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Enable rate limiting on auth endpoints",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Use strong password requirements" },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Implement session rotation" }],
              },
            ],
          },
        ],
      },
    ],
  });

  const article5Content = JSON.stringify({
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "React Server Components Explained" }],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "React Server Components (RSC) represent a " },
          { type: "text", marks: [{ type: "bold" }], text: "paradigm shift" },
          {
            type: "text",
            text: " in how we build React applications. They enable rendering components on the server, reducing bundle size and improving performance.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "The Problem RSC Solves" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Traditional React applications face several challenges:",
          },
        ],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Large JavaScript bundles sent to the client",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Waterfall requests for data fetching",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Unnecessary re-renders of static content",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Server Components solve these by rendering on the server and sending only the ",
          },
          { type: "text", marks: [{ type: "italic" }], text: "result" },
          { type: "text", text: " to the client." },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Server vs Client Components" }],
      },
      {
        type: "codeBlock",
        attrs: { language: "typescript" },
        content: [
          {
            type: "text",
            text: "// ✅ Server Component (default)\nasync function BlogPost({ id }: { id: string }) {\n  const post = await db.query.posts.findFirst({\n    where: eq(posts.id, id)\n  });\n  \n  return (\n    <article>\n      <h1>{post.title}</h1>\n      <Comments postId={id} /> {/* Client Component */}\n    </article>\n  );\n}\n\n// ❌ Client Component (interactive)\n'use client';\n\nfunction Comments({ postId }: { postId: string }) {\n  const [comments, setComments] = useState([]);\n  \n  return (\n    <div>\n      {comments.map(c => <Comment key={c.id} {...c} />)}\n    </div>\n  );\n}",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "When to Use Each" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [{ type: "bold" }],
            text: "Use Server Components when:",
          },
        ],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Fetching data from databases or APIs",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Accessing backend resources directly",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Keeping sensitive information on the server",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Reducing client-side JavaScript" },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [{ type: "bold" }],
            text: "Use Client Components when:",
          },
        ],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Using interactivity and event listeners (onClick, onChange, etc.)",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Using State and Lifecycle Effects (useState, useEffect, etc.)",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Using browser-only APIs" }],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Using custom hooks that depend on state or effects",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Golden Rule:" },
              {
                type: "text",
                text: " Start with Server Components by default. Only add 'use client' when you need interactivity.",
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Performance Benefits" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "By using Server Components effectively, you can achieve:",
          },
        ],
      },
      {
        type: "orderedList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Smaller bundles:",
                  },
                  {
                    type: "text",
                    text: " Server Component code never reaches the client",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Faster data fetching:",
                  },
                  {
                    type: "text",
                    text: " Direct database access without API routes",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Better SEO:",
                  },
                  {
                    type: "text",
                    text: " Fully rendered HTML sent to crawlers",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Improved security:",
                  },
                  {
                    type: "text",
                    text: " Sensitive data never exposed to client",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "React Server Components are not just a performance optimization—they're a new way of thinking about React architecture. Embrace them, and your applications will be faster, more secure, and easier to maintain.",
          },
        ],
      },
    ],
  });

  const article6Content = JSON.stringify({
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Advanced Database Patterns" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [{ type: "italic" }],
            text: "This article is still in draft and being worked on...",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Database design is one of the most critical aspects of building scalable applications. In this comprehensive guide, we'll explore advanced patterns and techniques for optimizing database performance.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Topics to Cover" }],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Indexing strategies" }],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Query optimization" }],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Partitioning and sharding" }],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Caching layers" }],
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", marks: [{ type: "bold" }], text: "Coming soon..." },
        ],
      },
    ],
  });

  const articlesResult = await client.query(`
    INSERT INTO article (title, excerpt, content, image, published, author_id)
    VALUES
      (
        'Getting Started with Next.js 15',
        'Learn how to build modern web applications with Next.js 15 and React Server Components. Discover the latest features including Turbopack, Partial Prerendering, and enhanced caching strategies.',
        '${article1Content.replace(/'/g, "''")}',
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        true,
        'user_1'
      ),
      (
        'TypeScript Best Practices in 2025',
        'Discover the latest TypeScript patterns and practices for writing maintainable code. Explore template literal types, const assertions, discriminated unions, and modern type-safe patterns.',
        '${article2Content.replace(/'/g, "''")}',
        'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
        true,
        'user_1'
      ),
      (
        'Building a Blog with Drizzle ORM',
        'A complete guide to setting up and using Drizzle ORM with PostgreSQL. Learn about schema definition, type-safe queries, relations, and database migrations.',
        '${article3Content.replace(/'/g, "''")}',
        'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=800',
        true,
        'user_2'
      ),
      (
        'Authentication with Better Auth',
        'Implement secure authentication in your Next.js application using Better Auth. Learn about email/password auth, social providers, route protection, and security best practices.',
        '${article4Content.replace(/'/g, "''")}',
        'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800',
        true,
        'user_2'
      ),
      (
        'React Server Components Explained',
        'Understanding the power and use cases of React Server Components. Learn when to use Server vs Client Components, performance benefits, and best practices for modern React architecture.',
        '${article5Content.replace(/'/g, "''")}',
        'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800',
        true,
        'user_1'
      ),
      (
        'Draft: Advanced Database Patterns',
        'Deep dive into advanced database design patterns and optimization techniques. Topics include indexing strategies, query optimization, partitioning, sharding, and caching layers.',
        '${article6Content.replace(/'/g, "''")}',
        'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
        false,
        'user_3'
      )
    RETURNING id;
  `);

  const articleIds = articlesResult.rows.map((row: { id: number }) => row.id);

  // Create article-tag relationships
  console.log("🔗 Creating article-tag relationships...");
  await client.query(`
    INSERT INTO articles_to_tags (article_id, tag_id)
    VALUES
      (${articleIds[0]}, '${tagMap.get("nextjs")}'),
      (${articleIds[0]}, '${tagMap.get("react")}'),
      (${articleIds[0]}, '${tagMap.get("tutorial")}'),
      (${articleIds[1]}, '${tagMap.get("typescript")}'),
      (${articleIds[1]}, '${tagMap.get("best-practices")}'),
      (${articleIds[2]}, '${tagMap.get("database")}'),
      (${articleIds[2]}, '${tagMap.get("nodejs")}'),
      (${articleIds[2]}, '${tagMap.get("tutorial")}'),
      (${articleIds[3]}, '${tagMap.get("nextjs")}'),
      (${articleIds[3]}, '${tagMap.get("web-dev")}'),
      (${articleIds[4]}, '${tagMap.get("react")}'),
      (${articleIds[4]}, '${tagMap.get("nextjs")}'),
      (${articleIds[4]}, '${tagMap.get("web-dev")}'),
      (${articleIds[5]}, '${tagMap.get("database")}'),
      (${articleIds[5]}, '${tagMap.get("best-practices")}')
    ON CONFLICT DO NOTHING;
  `);

  const end = Date.now();

  console.log("✅ Seed completed in", end - start, "ms");
  console.log(`   - Users: ${users.rowCount || 3}`);
  console.log(`   - Accounts: 3`);
  console.log(`   - Tags: 10`);
  console.log(`   - Articles: ${articlesResult.rowCount}`);
  console.log(`   - Article-Tag relations: 15`);

  process.exit(0);
};

export default seed;

try {
  await seed();
} catch (error) {
  console.error("❌ Connexion failed");
  console.error(error);
  process.exit(1);
}
