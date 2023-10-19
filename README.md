# Threadit

ThreadIt is a Reddit clone built with modern web technologies, including Next.js, Tailwind CSS, Radix UI, Planetscale (MySQL) as the database, Upstash Redis for optimistic updates during voting, and UploadThing for photo uploads. We've also integrated Editor.js to provide an exceptional user experience for content creation and editing.

### Features
- **User Authentication:** ThreadIt provides user authentication through Google, allowing users to sign in with their Google accounts.

- **Community Creation:** Users can create their own communities, which other users can follow. Communities act as subreddits, each having its own feed of posts.

- **Post Creation:** Registered users can create posts within communities, enabling them to share content and engage with the community.

- **Comments and Voting:** ThreadIt supports commenting on posts, allowing users to engage in discussions. Users can also vote on posts and comments, contributing to the community-driven content ranking.

### Tech Stack
#### Frontend:

- **Next.js:** A React framework for building the user interface.
- **Tailwind CSS:** A utility-first CSS framework for designing the application's UI.
- **Radix UI:** A set of low-level UI primitives for building accessible and composable user interfaces.

#### Backend:

- **Planetscale:** Utilized as the database to store user data, communities, posts, and comments.
- **Upstash Redis:** Employed for implementing optimistic updates during voting.

#### Content Editing:

- **Editor.js:** Enhances the user experience by providing a rich text editor for creating and editing content.
