# JobMart — Project Report

## Introduction

In today's rapidly evolving digital economy, the demand for flexible, gig-based, and daily wage employment opportunities has grown significantly, particularly in semi-urban and rural communities. Traditional job portals, while effective for formal employment, often fall short in addressing the needs of daily wage workers, local contractors, and small businesses seeking immediate, short-term labour. This gap in the market calls for a dedicated, hyperlocal platform that bridges workers and providers efficiently and accessibly.

**JobMart** is a full-stack, hyperlocal job marketplace web application designed to connect job seekers (workers) with employers (providers) for daily, part-time, and gig-based work opportunities within their local geographic area. The platform is tailored for the Indian market, with specific support for Kannada and English languages, making it inclusive and accessible to a wider demographic.

The application is built on the **MERN stack** — MongoDB, Express.js, React, and Node.js — and incorporates modern technologies such as geospatial search, JWT-based authentication, Google OAuth, and an interactive map interface powered by Leaflet. The frontend is developed using React 19 with Tailwind CSS for a responsive, mobile-first user experience, while the backend is powered by Express.js with MongoDB Atlas as the cloud database.

JobMart operates as a two-sided marketplace with two distinct user roles. **Workers** can browse and apply for jobs, manage their applications, save listings, and build a professional profile with ratings. **Providers** can post job listings, manage applications, accept or reject candidates, and track the hiring process end-to-end. The platform also features a networking module that allows users to discover and connect with others nearby, a real-time notification system, and a worker rating mechanism to build trust within the community.

Key highlights of the platform include:

- **Geolocation-based job and user discovery** using MongoDB's 2dsphere indexing
- **Bilingual interface** supporting English and Kannada
- **Mobile-first design** with swipeable job cards and bottom navigation
- **Dual authentication** via phone number/password and Google OAuth
- **Real-time notifications** for job assignments, application status updates, and new listings
- **AI-assisted job description generation** for providers

This report documents the design, architecture, implementation, and functionality of the JobMart application, covering the system's technical stack, database schema, API design, frontend structure, and the key modules that make up the platform.

## Objective

The primary objective of the JobMart project is to develop a hyperlocal, digital job marketplace that simplifies the process of finding and offering short-term, daily wage, and gig-based employment opportunities. The platform aims to address the disconnect between unskilled and semi-skilled workers and local employers by providing a structured, accessible, and technology-driven solution.

The specific objectives of the project are as follows:

1. **To build a two-sided marketplace** that caters to two distinct user roles — Workers seeking employment and Providers offering job opportunities — with tailored interfaces and functionality for each.

2. **To enable location-based job discovery** by leveraging geospatial technologies, allowing workers to find jobs near them and providers to reach candidates in their vicinity.

3. **To provide a streamlined job application workflow** where workers can browse, apply, withdraw, and track their applications, while providers can post jobs, review applicants, and manage hiring decisions from a single platform.

4. **To ensure secure and flexible authentication** by implementing both local authentication (phone number and password) and third-party authentication via Google OAuth, along with a recovery mechanism using a security keyword.

5. **To build a bilingual platform** supporting English and Kannada, ensuring the application is accessible to a broader user base in the Indian regional context.

6. **To implement a trust and reputation system** through worker ratings, enabling providers to make informed hiring decisions based on a worker's track record.

7. **To deliver a mobile-first, responsive user experience** with features such as swipeable job cards, bottom navigation, and map-based job views, optimised for users accessing the platform primarily via smartphones.

8. **To incorporate a real-time notification system** that keeps both workers and providers informed about job postings, application status changes, and job assignments.

9. **To integrate a networking and discovery module** allowing users to connect with others nearby, facilitating community-based employment referrals and professional relationships.

10. **To demonstrate the practical application of the MERN stack** — MongoDB, Express.js, React, and Node.js — in building a scalable, full-stack web application with RESTful API architecture and cloud database integration.

## Problem Statement

A large segment of the Indian workforce consists of daily wage earners, unskilled and semi-skilled labourers, domestic workers, and gig workers who depend on informal channels — word of mouth, local contractors, or physical labour markets — to find work. These methods are unreliable, time-consuming, and often exploitative, leaving workers with little bargaining power and no formal record of employment.

On the other side, small businesses, households, and local employers face similar challenges when trying to find trustworthy, available workers quickly. Without a centralised platform, the hiring process remains fragmented and inefficient.

The core problems this project addresses are:

1. **Lack of a structured platform for informal employment:** There is no dedicated, accessible digital solution for daily wage and gig-based job listings at a hyperlocal level. Existing job portals such as LinkedIn, Naukri, or Indeed are oriented towards formal, white-collar employment and are not suitable for short-term or daily wage work.

2. **Geographic mismatch:** Workers and providers often fail to connect simply because there is no location-aware system to match them based on proximity. A worker may be available nearby while a provider struggles to find someone, purely due to lack of a discovery mechanism.

3. **Absence of trust and verification:** In informal hiring, there is no mechanism for workers to build a verifiable reputation. Providers have no way to assess a worker's reliability, and workers have no way to validate the legitimacy of a job posting, leading to mutual distrust.

4. **Language and accessibility barriers:** Most digital job platforms operate exclusively in English, creating a significant barrier for regional language speakers. For a platform serving the local Indian market — particularly in Karnataka — the absence of Kannada language support limits reach and usability.

5. **No centralised application and hiring workflow:** Without a structured system, there is no way to track applications, communicate decisions, or manage vacancies. Both workers and providers are left to manage hiring through phone calls and informal agreements, with no record or accountability.

6. **Limited mobile accessibility:** The target demographic primarily uses smartphones with limited data connectivity. Platforms not optimised for mobile use are effectively inaccessible to this user group.

JobMart is designed to directly address each of these problems by providing a geolocation-aware, bilingual, mobile-first job marketplace that brings structure, transparency, and accessibility to hyperlocal employment.

## Literature Survey

The development of JobMart draws upon existing research, industry practices, and prior work in the domains of online job marketplaces, gig economy platforms, hyperlocal services, and full-stack web application development. The following survey reviews relevant work that informed the design and implementation of this project.

### 2.1 Online Job Marketplaces

Online job portals have evolved significantly since the late 1990s. Platforms such as Monster, Indeed, and Naukri pioneered the concept of digital recruitment by aggregating job listings and enabling resume-based applications. Research by Kuhn and Mansour (2014) demonstrated that internet job search significantly reduces unemployment duration, establishing the social utility of digital employment platforms.

However, these platforms are predominantly designed for formal, full-time employment. They require structured resumes, formal qualifications, and are primarily text-heavy and English-centric — making them inaccessible to a large segment of the informal workforce. JobMart addresses this gap by targeting daily wage and gig-based employment with a simplified, role-based interface.

### 2.2 Gig Economy and On-Demand Labour Platforms

The rise of the gig economy has given birth to a new class of platforms. Uber, TaskRabbit, UrbanClap (now Urban Company), and Dunzo have demonstrated the viability of on-demand, location-aware service marketplaces. Studies by Sundararajan (2016) in *The Sharing Economy* highlight how peer-to-peer platforms can reduce transaction costs and improve labour market efficiency.

Urban Company, in particular, is a close precedent to JobMart — it connects local service professionals (plumbers, electricians, beauticians) with customers. However, Urban Company acts as an intermediary with strict onboarding and pricing. JobMart takes a more open marketplace approach, allowing direct negotiation and application between workers and providers without platform-imposed pricing structures.

### 2.3 Hyperlocal Services and Geolocation-Based Discovery

Hyperlocal platforms leverage geographic proximity as a core feature. Research on location-based services (LBS) by Küpper (2005) established that proximity-aware systems significantly improve relevance of search results and user engagement. MongoDB's geospatial querying capabilities using 2dsphere indexes have been widely adopted in industry for implementing such proximity searches efficiently, as documented in official MongoDB research and developer documentation.

Platforms such as Craigslist and OLX have used location-based filtering for informal job listings, but lack structured workflows, role separation, and trust mechanisms. JobMart builds upon the hyperlocal discovery concept while adding structured hiring pipelines and reputation systems.

### 2.4 Two-Sided Marketplace Design

The economics of two-sided markets, as described by Rochet and Tirole (2003), show that platforms serving two distinct user groups must carefully balance value delivery for both sides to achieve network effects. In the context of JobMart, this means designing separately optimised experiences for Workers and Providers while ensuring that activity on one side directly benefits the other — more job postings attract more workers, and a larger worker pool attracts more providers.

This principle guided the dual-role architecture of JobMart, where each user type has distinct dashboards, workflows, and data visibility.

### 2.5 Authentication and Security in Web Applications

Modern web applications widely adopt JWT (JSON Web Tokens) for stateless authentication, as documented by Jones et al. in RFC 7519. The combination of local authentication and OAuth 2.0 (as implemented by Google) is a well-established industry pattern for balancing security and user convenience.

The use of bcrypt for password hashing with configurable salt rounds is considered a best practice in OWASP guidelines. JobMart implements these standards, including a secondary recovery mechanism via a hashed security keyword, providing an additional layer of account recovery without relying on SMS OTP infrastructure.

### 2.6 MERN Stack for Full-Stack Web Development

The MERN stack (MongoDB, Express.js, React, Node.js) has become one of the most widely adopted technology stacks for building scalable web applications. Its JavaScript-first approach allows code sharing between client and server, reduces context switching, and benefits from a large open-source ecosystem.

Research and industry surveys, including the Stack Overflow Developer Survey (2023), consistently rank JavaScript as the most used programming language, and React as the most popular frontend framework. MongoDB's flexible document model is particularly well-suited for rapidly evolving schemas such as job listings and user profiles, where fields may vary significantly across records.

### 2.7 Multilingual and Inclusive Design

UNESCO and W3C accessibility guidelines stress the importance of native language support in digital platforms to ensure equitable access. In the Indian context, where over 44 million people speak Kannada as a primary language, English-only interfaces present a significant usability barrier.

Prior work on multilingual React applications demonstrates that React's Context API combined with a key-value translation map is an effective, lightweight approach to internationalisation (i18n) without the overhead of large libraries such as i18next in simpler applications. JobMart adopts this pattern for its English/Kannada language toggle.

### 2.8 Summary

The literature and existing platforms collectively highlight several gaps that JobMart is designed to fill: the absence of structured informal job marketplaces, the need for hyperlocal discovery, the importance of trust mechanisms, and the necessity of language inclusivity. JobMart synthesises these insights into a cohesive, full-stack application that applies established technical practices — geospatial indexing, JWT authentication, OAuth integration, and responsive design — to a domain that has remained largely underserved by existing digital solutions.

## Methodology

The development of JobMart followed a structured, iterative software development approach, combining elements of the **Agile methodology** with a **component-driven development** model. The project was divided into clearly defined phases — requirements gathering, system design, implementation, testing, and deployment — with continuous refinement at each stage.

### 3.1 Development Approach

An **iterative and incremental approach** was adopted, where the application was built module by module rather than all at once. Each module — authentication, job management, applications, notifications, ratings, and connections — was developed, tested, and integrated independently before proceeding to the next. This ensured that each component was stable and functional before building dependencies on top of it.

The separation of the project into a **backend (API server)** and **frontend (React client)** allowed parallel development and clear boundary definition between data logic and presentation logic.

### 3.2 Requirements Analysis

The first phase involved identifying the needs of the two primary user groups — Workers and Providers — through analysis of existing platforms and the identified problem gaps. Functional requirements were derived for each role:

- **Worker requirements:** Registration, job browsing with filters, geolocation-based discovery, job application, application tracking, profile management, ratings visibility, and notifications.
- **Provider requirements:** Job posting, applicant management, application status updates, job status tracking, and worker rating.
- **Common requirements:** Secure authentication, bilingual support, mobile-first UI, real-time notifications, and user networking.

Non-functional requirements included system security (hashed passwords, JWT tokens), performance (pagination, indexed queries), and accessibility (Kannada language support).

### 3.3 System Design

#### 3.3.1 Architecture

JobMart follows a **client-server architecture** with a clear separation between the frontend and backend:

- The **React frontend** communicates with the backend exclusively via RESTful HTTP API calls using Axios.
- The **Express.js backend** handles all business logic, authentication, and database operations.
- **MongoDB Atlas** serves as the cloud-hosted database, accessed via Mongoose ODM.

This decoupled architecture ensures that the frontend and backend can be developed, tested, and deployed independently.

#### 3.3.2 Database Design

The database schema was designed around the core entities of the system:

- **User** — stores credentials, role, location (geospatial coordinates), status, saved jobs, and connections.
- **Profile** — stores extended user information such as skills, qualifications, bio, and profile picture.
- **Job** — stores job listing details including category, salary, job type, work mode, vacancy count, and geospatial location.
- **JobApplication** — links a Worker to a Job with application status, cover note, and proposed salary.
- **Notification** — stores system-generated notifications linked to users and related jobs or applications.
- **Rating** — stores provider-issued ratings for workers with score and feedback.
- **ConnectionRequest** — manages the lifecycle of connection requests between users.

Geospatial indexes (2dsphere) were applied to both the User and Job collections to enable efficient proximity-based queries.

#### 3.3.3 API Design

The backend exposes a RESTful API organised into six route groups: `/api/auth`, `/api/jobs`, `/api/applications`, `/api/users`, `/api/notifications`, and `/api/ratings`. Each route is protected by JWT middleware where authentication is required, and role-based middleware restricts certain actions (e.g., only Providers can post jobs, only Workers can apply).

### 3.4 Implementation

#### 3.4.1 Backend Implementation

The backend was implemented using **Node.js** with the **Express.js** framework. Key implementation decisions include:

- **Authentication:** Passport.js was used for Google OAuth 2.0 integration, while local authentication was handled manually with bcryptjs for password hashing (salt rounds: 12) and JWT for session tokens (7-day expiry).
- **Validation:** All incoming request data is validated using `express-validator` before reaching the controller logic.
- **Geospatial Queries:** MongoDB's `$near` and `$geoWithin` operators are used for proximity-based job and user discovery.
- **Notification Service:** A dedicated service layer handles the creation and dispatch of notifications on key events such as job assignment, application acceptance, and job completion.
- **Role Middleware:** A custom middleware layer enforces role-based access control across all protected routes.

#### 3.4.2 Frontend Implementation

The frontend was implemented using **React 19** with a functional component and hooks-based architecture. Key implementation decisions include:

- **State Management:** React Context API was used for global state — `AuthContext` manages user session data and `LanguageContext` manages the active language (English/Kannada).
- **Routing:** React Router DOM v7 handles client-side routing with protected route wrappers that redirect unauthenticated users to the login page.
- **UI Design:** Tailwind CSS was used for styling, enabling a utility-first, responsive design without the overhead of a component library. Lucide React provides the icon set.
- **Map Integration:** React Leaflet wraps the Leaflet.js library to provide interactive, map-based job discovery views.
- **Mobile UX:** Swipeable job cards (react-swipeable), a bottom navigation bar, and a mobile-optimised layout ensure a native-app-like experience on smartphones.
- **API Communication:** All API calls are centralised in a `services/` directory using Axios, with interceptors handling token attachment and error responses uniformly.

### 3.5 Testing

Testing was carried out at multiple levels:

- **Unit Testing:** Individual React components were tested using Jest and React Testing Library to verify rendering and user interaction behaviour.
- **API Testing:** Backend API endpoints were tested manually using tools such as Postman to verify request/response correctness, authentication enforcement, and error handling.
- **Integration Testing:** End-to-end flows — such as registration, job posting, application submission, and status updates — were tested by running the full stack locally and validating the complete data flow from frontend to database.
- **Edge Case Testing:** Scenarios such as applying to a fully filled job, withdrawing and reapplying, and concurrent application handling were tested to ensure correct system behaviour.

### 3.6 Deployment Considerations

The application is designed for straightforward local and cloud deployment:

- The backend is a standard Node.js/Express server, deployable on platforms such as Render, Railway, or a VPS.
- The frontend React app can be built into a static bundle and deployed on Netlify or Vercel, with the API base URL configured via environment variables.
- MongoDB Atlas provides a managed, cloud-hosted database with no local database setup required.
- Setup scripts (`setup.bat`, `setup.ps1`) are provided to automate dependency installation for Windows users, lowering the barrier for local setup.

### 3.7 Tools and Technologies Used

| Category | Technology |
|---|---|
| Frontend Framework | React 19 |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Maps | Leaflet / React Leaflet |
| Backend Framework | Express.js |
| Runtime | Node.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT, Passport.js, bcryptjs |
| Validation | express-validator |
| Version Control | Git |
| Package Manager | npm |

## Implementation

### 4.1 Project Structure and Architecture

JobMart is organised as a monorepo containing two independent sub-applications — `backend/` and `frontend/` — each with its own `package.json`, dependencies, and entry point. This separation enforces a clean boundary between the API layer and the presentation layer, allowing both to be developed, tested, and deployed independently.

The backend follows an **MVC-inspired layered architecture**:
- **Routes** define API endpoints and their middleware chains.
- **Controllers** contain request handling and business logic.
- **Models** define MongoDB schemas and data constraints.
- **Middleware** handles cross-cutting concerns such as authentication and authorisation.
- **Services** encapsulate reusable side-effect logic such as notification creation.

The frontend follows a **page and component-based architecture**:
- **Pages** represent full screen views mapped to routes.
- **Components** are reusable UI pieces grouped by domain (jobs, profile, auth, layout, ui).
- **Context** provides global state (authentication, language).
- **Services** centralise all API calls.
- **Hooks** encapsulate reusable component logic.

---

### 4.2 Backend Implementation

#### 4.2.1 Server Setup

The Express application is initialised in `server.js`. The middleware stack is applied in the following order: CORS configuration (which explicitly allows `localhost:3000`, `*.netlify.app` subdomains, and the configured `FRONTEND_URL` environment variable, with credentials enabled), JSON body parsing, Morgan HTTP request logging in development mode, express-session (required by Passport for OAuth session handling), and Passport initialisation.

Six route groups are mounted under the `/api` prefix. If the frontend React build directory exists (`frontend/build`), the server also serves it as static files, with a catch-all SPA fallback that returns `index.html` for non-API routes. A `/api/health` endpoint is exposed for deployment health checks. A global error handler catches any unhandled exceptions and returns a standardised JSON 500 response.

#### 4.2.2 Database Connection

The application connects to MongoDB Atlas using Mongoose. The connection URI is read from the `MONGODB_URI` environment variable. Geospatial queries depend on 2dsphere indexes defined directly on the User and Job model schemas, which Mongoose automatically creates when the application starts.

---

#### 4.2.3 Authentication Module

Authentication in JobMart is implemented through two strategies managed in `auth.controller.js` and configured via `config/passport.js`.

**Local Authentication (Phone + Password):**

During registration, the controller validates that a name, phone number, password (minimum 6 characters), role (`worker` or `provider`), and a recovery keyword are provided. It checks for duplicate phone numbers before proceeding. The password is hashed using bcrypt with 12 salt rounds. The recovery keyword is normalised — lowercased and trimmed — before being hashed separately with 10 salt rounds. A User document is created with `authProvider: 'local'` and `isVerified: true` (skipping an email verification step for simplicity). An empty Profile document is immediately created and linked to the new User, ensuring a Profile always exists for every user. A JWT token is generated with a 7-day expiry and returned alongside a sanitised user payload (id, name, phone, role, language).

During login, the user is queried by phone number using `.select('+password')` to explicitly include the password field, which is excluded from all normal queries by the schema's `select: false` setting. The submitted password is compared against the stored hash using bcrypt's compare function. A generic `"Invalid credentials"` error is returned regardless of whether the phone number or password is wrong, to prevent user enumeration attacks.

**Google OAuth:**

Passport.js is configured with the Google OAuth 2.0 strategy. On a successful Google callback, the system checks whether a user with the matching Google ID already exists. If not, it creates a new User with `authProvider: 'google'`, sets `isVerified: true`, and creates the associated Profile. A JWT token is generated and passed to the frontend via a URL redirect to `/auth/google/success?token=...&user=...`. The frontend intercepts this on the callback page, extracts the values from the query string, stores them in localStorage, and redirects to the dashboard.

**Password Recovery:**

A dedicated `resetPassword` endpoint accepts a phone number, the plain-text recovery keyword, and a new password. The user is queried with `.select('+recoveryKeyword')` to include the hidden field. The submitted keyword is normalised and compared against the stored hash using bcrypt. On a successful match, the new password is hashed with 12 salt rounds and the user record is updated. This mechanism is only available for `authProvider: 'local'` users.

**JWT Middleware:**

The `protect` middleware in `auth.middleware.js` is applied to all routes that require authentication. It extracts the Bearer token from the `Authorization` header, verifies the JWT signature against `process.env.JWT_SECRET`, decodes the user ID from the payload, fetches the full User document from the database, and attaches it to `req.user` for downstream use. If any step fails, a 401 Unauthorised response is returned.

**Role Middleware:**

The `authorize(...roles)` function in `role.middleware.js` returns a middleware that checks `req.user.role` against the allowed roles array. If the user's role is not in the permitted list, a 403 Forbidden response is returned with a message indicating the role is not authorised. This is applied on all provider-only and worker-only routes.

---

#### 4.2.4 User and Profile Module

The User and Profile models have a strict one-to-one relationship enforced by a `unique` constraint on `Profile.user`. The Profile is always created automatically at registration, so it is safe to assume every user has a Profile.

**Profile Update:** When a user updates their profile, both the User document (name, age, whatsappNumber, language, location) and the Profile document (skills, qualification, jobCategory, bio, status) are updated in a single request. The location is stored as a GeoJSON Point with `type: 'Point'` and `coordinates: [longitude, latitude]` alongside a human-readable address string.

**Availability Status:** Workers can set their status to `'available'` or `'busy'`. This is managed on the Profile model. When a worker is accepted for a job, the system automatically sets their status to `'busy'` to signal to other providers that they are currently engaged.

**Saved Jobs:** The `saveJob` endpoint toggles a job reference in the `Profile.savedPosts` array. If the job ID is already present, it is filtered out; otherwise it is pushed in. This toggle approach means a single endpoint handles both saving and unsaving.

**Contact Privacy:** The `getContactInfo` endpoint enforces a privacy rule — a user's phone number and WhatsApp number are only returned if the requesting user is in the target user's `Profile.connections` array. If they are not connected, a 403 response is returned with a "Not connected" message. This prevents unrestricted access to personal contact details.

---

#### 4.2.5 Job Management Module

**Job Creation:** Only users with the `provider` role can post jobs, enforced by the `authorize('provider')` middleware. A job document is created with a title, category, number of vacancies, salary (amount and period), job type, work mode, and location. The provider's WhatsApp contact is automatically used if one is not explicitly provided for the job. The location is stored as a GeoJSON Point, enabling all subsequent geospatial queries.

**Job Search and Filtering:** The `getJobs` endpoint is the most feature-rich query in the application. It supports the following filter parameters simultaneously:
- **category** — a case-insensitive regex match on the category field.
- **jobType** — exact enum match (`part-time` or `full-time`).
- **workMode** — exact enum match (`remote` or `offline`).
- **minSalary / maxSalary** — a range query on `salary.amount`.
- **status** — defaults to `'open'` if not specified.
- **search** — a regex applied across `title`, `description`, and `category` fields simultaneously using MongoDB's `$or` operator.
- **lat / lng / radius** — if all three are provided, a `$near` geospatial operator is applied on the job's location field, converting the radius from kilometres to metres. Results are returned sorted by proximity automatically by MongoDB.

Results are limited to 50 documents per query and the provider's details are populated via a join.

**Job Ownership Checks:** Both the update and delete endpoints perform an explicit authorisation check — the `job.provider` field (the ObjectId of the creating provider) must match `req.user._id`. If not, a 403 Forbidden response is returned, even though the user has already passed the role middleware.

**Provider Job Dashboard:** The `getMyJobs` endpoint returns a provider's jobs that are either currently open or assigned, or were created within the last 30 days, sorted by creation date descending. This gives providers a view of their active and recent job history.

**Job Status Lifecycle:** Jobs progress through a defined status lifecycle: `open` → `assigned` (when all vacancies are filled) → `completed` (when the provider marks the work done) → `closed` (manual closure). Each transition has specific business logic and triggers corresponding notifications.

---

#### 4.2.6 Job Application Module

**Applying for a Job:** The `applyForJob` controller first validates that the target job exists and has a status of `'open'`. It prevents a provider from applying to their own jobs. It then checks for any existing application from the same worker for the same job — if one exists with a status of `'withdrawn'`, it resubmits that application by updating its status back to `'pending'` rather than creating a duplicate. The `{job, applicant}` unique compound index on the JobApplication model enforces this at the database level as well.

**Application Listing for Workers:** The `getMyApplications` endpoint returns all of a worker's applications with full job details populated — title, category, salary, job type, work mode, status, location, provider info, and dates. Results are sorted by creation date descending.

**Application Listing for Providers:** The `getJobApplications` endpoint performs additional enrichment beyond a simple query. After fetching all applications for the job, it fetches each applicant's Profile to retrieve their average rating, total ratings, status, and skills. The final list is then sorted client-side (in the controller) — accepted applications appear first, and within each group, applicants are sorted by their average rating in descending order. This ensures the highest-rated, most reliable workers are surfaced to the provider at the top of the list.

**Accepting an Application:** This is the most complex operation in the application module. When a provider accepts an application:
1. The system checks that the job still has available vacancies (`filledVacancies < vacancies`). If not, it returns a 400 error.
2. The job's `filledVacancies` counter is incremented.
3. If `filledVacancies` now equals or exceeds `vacancies`, the job's status is changed to `'assigned'`, indicating it is fully staffed.
4. The accepted applicant's Profile status is set to `'busy'`.
5. A `notifyJobAssigned` notification is sent to the accepted worker.
6. **Auto-rejection of remaining applicants:** If the job became fully assigned in this step, all other pending applications for that job are fetched and their status is set to `'filled'`. A `notifyJobFilled` notification is sent to each of these workers, informing them that the position has been filled.
7. An `notifyApplicationUpdate` notification is also sent to the applicant with the new status.

**Withdrawing an Application:** Only applications in `'pending'` status can be withdrawn. Once withdrawn, the worker can reapply later, which resubmits the same document rather than creating a new one.

---

#### 4.2.7 Notification Module

The notification system is built around a dedicated Notification model and a centralised `notification.service.js` file. The service exposes named functions for each notification event type, each creating a Notification document with a `recipient`, `type`, `title`, `message`, and optional `relatedJob` or `relatedApplication` references. All service functions catch and silently log errors to ensure that notification failures never break the primary business logic flow.

The following notification types are defined: `new_job`, `job_assigned`, `job_completed`, `application_update`, `new_rating`, `connection_request`, and `connection_accepted`. Each maps to a human-readable title and message template.

The controller exposes endpoints to fetch notifications (sorted newest-first, limited to 50), retrieve the unread count (used for badge display in the UI), mark a specific notification as read, and bulk-mark all notifications as read. An `{recipient, isRead}` compound index on the Notification model makes the unread count query efficient.

---

#### 4.2.8 Rating Module

Ratings can only be submitted after a job is marked as `'completed'`. The `addRating` controller validates that the job exists and has the correct status, prevents self-rating, and enforces a one-rating-per-rater-per-job rule via the `{job, rater}` unique compound index. After a rating is created, the controller immediately recalculates the ratee's average rating by fetching all their Rating documents, computing the mean, rounding to one decimal place, and updating the `averageRating` and `totalRatings` fields on the Profile. This keeps the rating statistics always current without requiring a separate aggregation job.

---

#### 4.2.9 Connection and Networking Module

JobMart implements two distinct connection mechanisms. The first is a **direct toggle connection** — a single API call to `POST /api/users/connect/:userId` either adds or removes a bidirectional connection between two users immediately, without a request-accept flow. The second is a **formal connection request flow** — a user sends a request via `POST /api/users/request/:userId`, which creates a ConnectionRequest document and triggers a notification. The target user can then view incoming requests and accept or reject them. On acceptance, both users' `Profile.connections` arrays are updated using `$addToSet` to prevent duplicate entries, and a notification is sent back to the requester.

The `discoverUsers` endpoint returns all users except the current user, sorted by average rating descending, limited to 50. Phone numbers are not included in this response to protect privacy. The `getNearbyUsers` endpoint uses MongoDB's `$geoNear` aggregation operator to find users of the opposite role within a configurable radius (maximum 50 km), returning up to 60 results enriched with Profile data and distance in kilometres.

---

### 4.3 Frontend Implementation

#### 4.3.1 Application Bootstrap and Routing

The React application entry point in `App.js` wraps the entire component tree with `LanguageProvider` (outermost), `AuthProvider`, and `BrowserRouter`. React Hot Toast is configured globally with a bottom-centre position, 3-second duration, and a dark colour scheme.

Routing is handled by `React Router DOM v7`. Four types of route wrappers are defined:
- **RootRedirect:** Handles the `/` path by checking authentication state and whether the user has seen the landing page before (via a `jobmart_seen_landing` flag in localStorage). Authenticated users go to `/dashboard`, returning unauthenticated visitors go to `/login`, and first-time visitors go to `/welcome`.
- **LandingRoute:** Redirects authenticated users away from the landing page to the dashboard.
- **PublicRoute:** Redirects authenticated users away from auth pages (login, register) to the dashboard.
- **ProtectedRoute:** Redirects unauthenticated users to `/login`. All authenticated application pages use this wrapper.

All authenticated pages are rendered inside a shared `AppLayout` component which provides the consistent header, navigation bar, and bottom navigation structure.

#### 4.3.2 Authentication State Management

`AuthContext` manages the global authentication state using React's Context API and `useReducer`/`useState`. On mount, it initialises the user state by reading from `localStorage['user']` and `localStorage['token']`. The `login(token, userData)` method stores both values in localStorage and updates React state. The `logout()` method clears localStorage and resets the user to null. The `isAuthenticated` boolean is derived from the presence of a user object. All API service files read the token from localStorage to attach it as a Bearer header on every outgoing request.

#### 4.3.3 Language and Internationalisation

`LanguageContext` manages the active language using a simple state variable initialised from `localStorage['jobmart_lang']`, defaulting to `'en'`. The `switchLang(l)` method updates both state and localStorage. UI components consume the language value through the `useLanguage()` hook and apply translations using a key-value mapping object, switching between English and Kannada strings based on the active language.

#### 4.3.4 Key Frontend Pages

- **LandingPage:** First-time visitor welcome screen. Sets the `jobmart_seen_landing` flag in localStorage when the user proceeds, so they are directed to the login page on subsequent visits.
- **LoginPage:** Handles both login and registration in a single component with a mode toggle. Also provides the Google OAuth login button, which redirects to the backend's `/api/auth/google` route. A dedicated `/auth/google/success` route handles the OAuth callback — it reads the token and user from URL query parameters, calls `AuthContext.login()`, and redirects to the dashboard.
- **BrowseJobsPage:** The primary discovery interface for workers. Supports full-text search, category/type/mode/salary filters, and a toggle between a list view and a map view. The map view uses React Leaflet to display job locations as pins with popups. Jobs can also be browsed via a Tinder-style swipeable card interface using the `react-swipeable` library.
- **PostJobPage:** Provider-only form for creating job listings. Includes optional AI-assisted description generation.
- **MyJobsPage:** Provider dashboard showing active and recent jobs, with the ability to view applicants, update job status, and complete jobs.
- **MyApplicationsPage:** Worker view of all submitted applications with status badges.
- **ConnectionsPage:** Combines the discover users, nearby users, connection requests, and existing connections views.
- **NotificationsPage:** Lists all notifications with read/unread state and mark-as-read functionality.
- **ProfilePage:** Allows users to edit their profile, update location, toggle availability status, and view their ratings.

#### 4.3.5 API Service Layer

All HTTP calls are centralised in the `src/services/` directory, organised by domain (auth, jobs, applications, users, notifications, ratings). Each service file uses Axios and attaches the JWT token from localStorage as the `Authorization: Bearer <token>` header on every request. The backend API base URL is configured via the `proxy` field in the frontend's `package.json` during development, and via `REACT_APP_API_URL` in production builds.

---

### 4.4 Data Flow: End-to-End Job Hiring Lifecycle

To illustrate how the frontend, API, and database work together, the complete job hiring lifecycle is as follows:

1. A **Provider** registers, sets their location, and posts a job. The job is stored in MongoDB with status `'open'` and the provider's coordinates as a GeoJSON Point.
2. A **Worker** registers, sets their location and skills in their profile, and browses jobs — either by keyword search, category filter, or by proximity using the geospatial query.
3. The Worker views the job detail page and submits an application with a cover note and proposed salary. A JobApplication document is created with status `'pending'`.
4. The Provider views the list of applicants for their job, sorted by average rating. They choose to accept an application.
5. The backend increments `filledVacancies`, marks the Worker's Profile status as `'busy'`, and if all vacancies are now filled, transitions the job to `'assigned'` and auto-rejects all remaining pending applicants with `'filled'` status. Notifications are dispatched to all affected parties.
6. After the work is completed, the Provider marks the job as `'completed'`. Accepted workers receive a notification that the job is done.
7. The Provider rates the Worker (score 1–5 with optional feedback). The Worker's `averageRating` and `totalRatings` on their Profile are immediately recalculated and stored. The Worker receives a `new_rating` notification.
8. The Worker's updated rating is visible to all future Providers who view their profile, reinforcing the reputation system.

## Results

This section presents the outcomes of the JobMart project — the functional modules delivered, the screens and user flows achieved, the system behaviour under key scenarios, and the overall state of the application.

---

### 5.1 Functional Modules Delivered

All core modules planned during requirements analysis were successfully implemented and are operational. The following table summarises the modules and their delivery status:

| Module | Status | Key Outcomes |
|---|---|---|
| User Registration & Login | Complete | Phone/password and Google OAuth both functional |
| Password Recovery | Complete | Recovery via hashed security keyword |
| Job Posting (Provider) | Complete | Full CRUD with vacancy tracking |
| Job Browsing & Search (Worker) | Complete | Filters, full-text search, geospatial proximity |
| Job Applications | Complete | Apply, withdraw, re-apply all functional |
| Application Management (Provider) | Complete | Accept, reject, auto-fill vacancy logic |
| Ratings & Reviews | Complete | 1–5 star ratings, live average recalculation |
| Notification System | Complete | 7 event types, unread count, mark-as-read |
| User Connections | Complete | Both direct toggle and request-based flows |
| Nearby User Discovery | Complete | Geospatial aggregation with radius filter |
| Saved Jobs | Complete | Toggle save/unsave |
| Bilingual UI | Complete | English and Kannada toggle |
| Map View | Complete | Leaflet-based job location map with pins |
| Swipeable Job Cards | Complete | Mobile swipe gesture support |
| AI Job Description | Partial | Mock service implemented; AI call is a placeholder |
| QR Code Sharing | Complete | QR code generation for job listings |

---

### 5.2 Application Screens and User Flows

#### 5.2.1 Landing and Authentication

On first launch, users are presented with a landing page introducing the platform. Returning users are directed straight to the login page. The login screen supports two flows — local authentication via phone number and password, and Google OAuth login. Registration collects the user's name, phone number, role (Worker or Provider), password, and a recovery keyword. Upon successful registration or login, the user is issued a JWT token stored in localStorage and redirected to the dashboard.

The Google OAuth flow redirects the user to Google's consent screen, returns a callback to the backend, and then redirects to the frontend with the token embedded in the URL. The success page extracts this and completes the login seamlessly.

The password recovery screen allows users to reset their password by providing their registered phone number and their recovery keyword, without requiring an OTP or email link — making it usable in low-connectivity environments.

#### 5.2.2 Worker Dashboard and Job Discovery

After login, a Worker lands on a role-specific dashboard showing quick action links and summary information. The Browse Jobs page is the primary feature for workers. It presents job listings in a card-based list view by default, with each card showing the job title, category, salary, job type, work mode, and provider location.

Workers can filter results using a combination of:
- Free-text search across title, description, and category
- Category selector
- Job type (part-time / full-time)
- Work mode (remote / offline)
- Salary range (min and max)

A map view toggle switches from the card list to a Leaflet map where job locations are represented as pins. Clicking a pin shows a popup with job summary details and a link to the full job page. A swipe view is also available, presenting jobs as stackable cards that the user can swipe through in a Tinder-like interaction, particularly suited for mobile use.

On the job detail page, the worker can read the full description, view the provider's information, and submit an application with an optional cover note and proposed salary. Once applied, the application status is tracked on the My Applications page, where workers can see the current status (pending, accepted, rejected, withdrawn, or filled) for all their submissions. Pending applications can be withdrawn at any time, and withdrawn applications can be resubmitted.

Workers can also save jobs to a personal saved list using the bookmark icon on any job card or detail page, accessible from the Saved Jobs page.

#### 5.2.3 Provider Dashboard and Job Management

Providers land on a dashboard that surfaces their active job postings and quick links to post a new job or view applicants. The Post Job form collects all required fields — title, category, vacancies, salary amount and period, job type, work mode, location, and optional WhatsApp contact. An AI description button is present on the form, which in the current implementation returns a mock-generated description.

The My Jobs page lists all of the provider's posted jobs. For each job, the provider can see the vacancy count, fill count, and current status. From this page, they can navigate to the applicants list for a specific job.

The applicants list shows all workers who applied, sorted by average rating with accepted applicants at the top. Each applicant card shows their name, skills, bio, rating, status, proposed salary, and cover note. The provider can accept or reject individual applicants. On accepting, the vacancy fill count updates in real time and once all vacancies are filled, the job status automatically changes to "Assigned". When the work is done, the provider can mark the job as completed, which unlocks the rating flow.

#### 5.2.4 Ratings Flow

After a job is marked as completed, the provider can navigate to the rating screen and submit a 1–5 star rating for each accepted worker along with optional text feedback. The worker's average rating is recalculated immediately and displayed on their public profile. Workers receive a notification when they are rated.

#### 5.2.5 Notifications

The Notifications page displays all system-generated notifications in reverse chronological order. Notifications are categorised by type — job assigned, application update, job completed, new rating, connection request, and connection accepted — each with a distinct message. Unread notifications are visually highlighted. Individual notifications can be marked as read, or all can be cleared at once. A badge count on the navigation icon shows the number of unread notifications.

#### 5.2.6 Connections and Networking

The Connections page is divided into sub-sections:
- **Discover:** A paginated list of all platform users sorted by rating, allowing the current user to browse profiles and send connection requests or toggle direct connections.
- **Nearby:** A list of users of the opposite role within a configurable radius, fetched using geospatial proximity. Each result shows distance in km, skills, job category, rating, and availability status.
- **Requests:** Incoming pending connection requests with accept and decline buttons.
- **My Connections:** All current connections with links to view profiles and access contact information (only visible to connected users).

#### 5.2.7 Profile Management

The profile page allows users to update their name, age, bio, skills (as a comma-separated list), qualification, preferred job category, WhatsApp number, language preference, and location. Location can be set manually or detected from the browser's geolocation API. Workers can toggle their availability status between Available and Busy. The profile also displays the user's average rating and total number of ratings received.

---

### 5.3 System Behaviour Under Key Scenarios

#### Scenario 1 — Job Fully Staffed
When a provider accepts the last available vacancy for a job, the system atomically increments the fill count, transitions the job status to `'assigned'`, marks the accepted worker as `'busy'`, and dispatches `'filled'` status updates to all remaining pending applicants with a notification informing them the position has been taken. This entire operation completes within a single API call.

#### Scenario 2 — Duplicate Application Prevention
A worker who attempts to apply to a job they have already applied to (and not withdrawn) receives an error response. If they previously withdrew their application and attempt to reapply, the existing document is reactivated rather than a new one being created, preserving the application history while respecting the unique index constraint.

#### Scenario 3 — Contact Privacy Enforcement
A worker who views another user's profile can see their name, rating, skills, and bio but cannot see their phone number or WhatsApp number. The contact information is only revealed once both parties are connected, enforced at the API level regardless of what the frontend requests.

#### Scenario 4 — Geospatial Job Discovery
A worker with location coordinates set searches for jobs within a 5 km radius. MongoDB's `$near` operator returns only jobs whose stored GeoJSON coordinates fall within that radius, sorted by distance. If the worker has not set a location, the geospatial filter is simply not applied, and all jobs matching the other filters are returned instead.

#### Scenario 5 — Google OAuth New User
A user who signs in with Google for the first time is automatically registered — a User document with `authProvider: 'google'` and a linked empty Profile are created without any additional form submission. On subsequent logins with the same Google account, the existing user is retrieved by their Google ID and a fresh JWT is issued.

---

### 5.4 API Endpoints Summary

The backend exposes 35 RESTful API endpoints across six route groups, all returning JSON responses:

| Route Group | Endpoints | Total |
|---|---|---|
| `/api/auth` | register, login, reset-password, me, Google OAuth | 5 |
| `/api/jobs` | create, create-with-AI, list, get-by-id, update, delete, my-jobs, complete | 8 |
| `/api/applications` | apply, my-applications, job-applicants, update-status, withdraw | 5 |
| `/api/users` | profile (get/update), status, save-job, connect, request, requests (get/respond), discover, nearby, contact, get-by-id | 12 |
| `/api/notifications` | list, unread-count, mark-read, mark-all-read | 4 |
| `/api/ratings` | add-rating, get-user-ratings | 2 |

---

### 5.5 Technical Outcomes

- **Geospatial queries** using MongoDB 2dsphere indexes are functional for both job proximity search and nearby user discovery, with configurable radius in kilometres.
- **JWT authentication** is enforced on all 30 of the 35 endpoints (5 public auth endpoints), with role-based access control correctly restricting provider-only and worker-only operations.
- **Bilingual support** is fully operational — all UI labels, buttons, and messages switch between English and Kannada based on the user's language preference, which is persisted across sessions via localStorage.
- **Real-time-like notifications** are generated for all 7 defined event types and are reliably delivered to the correct recipients without affecting the primary transaction flow.
- **Mobile-first design** is achieved with a responsive Tailwind CSS layout, bottom navigation bar, swipeable card interactions, and touch-optimised form elements.
- **Cloud database integration** via MongoDB Atlas eliminates the need for a local database installation, simplifying setup and enabling the application to be run on any machine with Node.js installed.

---

## Conclusion

JobMart was conceived to address a real and largely unmet need — providing a structured, digital, and accessible platform for hyperlocal, informal employment in the Indian context. The project set out to build a two-sided job marketplace connecting daily wage workers with local providers, with a strong emphasis on geolocation-based discovery, mobile-first usability, bilingual accessibility, and trust through reputation.

The application has been successfully implemented as a full-stack web platform using the MERN stack. All primary objectives defined at the outset of the project have been met. A secure, dual-mode authentication system handles both local and Google OAuth sign-ins. A comprehensive job management workflow covers the entire hiring lifecycle — from job posting and application to acceptance, job completion, and worker rating. Geospatial indexing enables proximity-based job and user discovery. The notification system keeps both workers and providers informed at every stage of the process. The bilingual interface ensures the platform is usable by Kannada-speaking users who may not be comfortable with English-only digital tools.

From a technical standpoint, the project demonstrates a clean separation of concerns between the API layer and the presentation layer, role-based access control enforced at the middleware level, data integrity maintained through schema-level validations and unique compound indexes, and a privacy-aware design where sensitive contact information is only accessible between connected users.

The project also highlights the suitability of the MERN stack for building data-driven, location-aware, multi-role applications within a realistic development timeframe. MongoDB's flexible document model and native geospatial support proved particularly well-suited to the requirements of this domain, while React's component-based architecture enabled a consistent and maintainable frontend across a large number of distinct page views.

In summary, JobMart demonstrates that a thoughtfully designed technology solution can bring meaningful structure, transparency, and efficiency to a segment of the labour market that has historically relied on informal and fragmented channels. The platform lays a solid technical foundation upon which further enhancements can be built.

---

## Future Work

While the current implementation delivers a fully functional job marketplace, several enhancements can be pursued in future iterations to improve the platform's reach, reliability, and feature set.

### 7.1 Real-Time Communication

The current notification system stores notifications in the database and retrieves them on demand. A future version could integrate **WebSockets** (via Socket.IO) or **Server-Sent Events** to deliver notifications to the client in real time without requiring a page refresh. This would significantly improve the user experience for time-sensitive events such as job acceptance or new connection requests.

### 7.2 OTP-Based Phone Verification

The current registration flow sets `isVerified: true` immediately without verifying the phone number. A proper **OTP (One-Time Password) verification** step using an SMS gateway such as Twilio or MSG91 would ensure that phone numbers are genuine, reduce fraudulent registrations, and enable phone-based password recovery as a more reliable alternative to the security keyword.

### 7.3 Genuine AI Integration

The AI job description generation feature currently uses a mock service that returns placeholder text. Integrating a real language model — such as the **Claude API** or **OpenAI GPT** — would allow providers to generate accurate, contextually relevant job descriptions from minimal input (job title, category, salary, and type), reducing the effort required to post quality listings.

### 7.4 In-App Chat

A direct messaging system between connected users would remove the need to share phone numbers for routine communication. A lightweight chat module with conversation history, message read status, and optional file sharing would make the platform more self-contained and reduce the friction of coordinating outside the app.

### 7.5 Advanced Search and Recommendations

The current search system supports filtering and proximity queries but does not personalise results. A recommendation engine that surfaces relevant jobs to workers based on their listed skills, job category preference, and past application history would improve job discovery. Similarly, providers could receive recommendations of highly-rated, available workers matching their job's requirements.

### 7.6 Payment and Earnings Tracking

Integrating a payment gateway such as Razorpay or UPI-based payment flows would allow providers to release payments to workers through the platform, creating a formal transaction record. An earnings dashboard for workers and a payments history for providers would add significant value for users who conduct recurring business on the platform.

### 7.7 Mobile Application

While the current web application is mobile-optimised, a dedicated **React Native** mobile application would provide a more native experience, including push notifications (via Firebase Cloud Messaging), background location tracking for proximity alerts, and offline capabilities. Given that the target demographic is primarily smartphone users with limited data, a lightweight native app would substantially improve adoption.

### 7.8 Admin Panel and Moderation

As the user base grows, a backend administration panel would be necessary to moderate job listings, review flagged users, manage disputes, monitor platform activity, and enforce quality standards. Role-based admin access with audit logging would be essential for safe and accountable platform management.

### 7.9 Multi-Language Expansion

The current bilingual implementation supports English and Kannada. The internationalisation architecture can be extended to support additional Indian regional languages — such as Hindi, Tamil, Telugu, and Malayalam — by adding corresponding translation key-value maps, significantly expanding the platform's geographic and demographic reach.

### 7.10 Analytics and Insights

A dashboard providing analytics to providers — such as application conversion rates, average time-to-hire, and worker availability trends by area — would help them make more informed hiring decisions. Similarly, aggregate platform-level analytics could guide operational decisions such as which job categories are most active in which locations.

---

## Bibliography

1. Kuhn, P., & Mansour, H. (2014). *Is Internet Job Search Still Ineffective?* The Economic Journal, 124(581), 1213–1233. Oxford University Press.

2. Sundararajan, A. (2016). *The Sharing Economy: The End of Employment and the Rise of Crowd-Based Capitalism.* MIT Press.

3. Rochet, J. C., & Tirole, J. (2003). *Platform Competition in Two-Sided Markets.* Journal of the European Economic Association, 1(4), 990–1029.

4. Küpper, A. (2005). *Location-Based Services: Fundamentals and Operation.* John Wiley & Sons.

5. Jones, M., Bradley, J., & Sakimura, N. (2015). *JSON Web Token (JWT).* RFC 7519. Internet Engineering Task Force (IETF). Retrieved from https://www.rfc-editor.org/rfc/rfc7519

6. OWASP Foundation. (2023). *OWASP Top Ten — Web Application Security Risks.* Open Web Application Security Project. Retrieved from https://owasp.org/www-project-top-ten/

7. MongoDB, Inc. (2024). *Geospatial Queries — MongoDB Manual.* Retrieved from https://www.mongodb.com/docs/manual/geospatial-queries/

8. Stack Overflow. (2023). *Developer Survey 2023.* Stack Overflow Insights. Retrieved from https://survey.stackoverflow.co/2023/

9. W3C. (2018). *Web Content Accessibility Guidelines (WCAG) 2.1.* World Wide Web Consortium. Retrieved from https://www.w3.org/TR/WCAG21/

10. UNESCO. (2003). *Education in a Multilingual World — UNESCO Education Position Paper.* United Nations Educational, Scientific and Cultural Organization.

11. React Documentation. (2024). *React — The Library for Web and Native User Interfaces.* Meta Open Source. Retrieved from https://react.dev/

12. Express.js. (2024). *Express — Fast, Unopinionated, Minimalist Web Framework for Node.js.* OpenJS Foundation. Retrieved from https://expressjs.com/

13. Mongoose. (2024). *Mongoose — Elegant MongoDB Object Modeling for Node.js.* Retrieved from https://mongoosejs.com/

14. Passport.js. (2024). *Passport — Simple, Unobtrusive Authentication for Node.js.* Retrieved from https://www.passportjs.org/

15. Aggarwal, A., & Bhatt, M. (2020). *Digital Labour Platforms and Transformation of Work in India.* International Labour Organization (ILO) Working Paper.
