# Job Tracker App
A React.js-based job application tracker to help users organize and manage their job search efficiently. Users can add, edit, filter, and sort job applications, view statistics, upload screenshots, and more — all with a responsive and modern UI.

## Features

* User Authentication
  * Sign up, log in, and log out securely using Supabase Auth
  * Email confirmation on sign up
  * Each user's data is private and scoped to their account only
* Password Reset Workflow
  * Users can request a reset email and set a new password through a dedicated route
* Add & Manage Job Applications
  * Add jobs with fields for company, role, status, optional description, posting URL, and screenshot
* Edit & Update Jobs
  * Modify job details and replace or remove screenshots at any time
* Delete Job Applications
  * Easily remove entries, including screenshots stored in Supabase
* Filter by Status & Sort Applications
  * Filter by: Applied, Interview, Offer, Rejected, or All
  * Sort by: Newest First, Oldest First, Company, or Role
* Job Statistics Panel
  * Toggleable side panel that displays counts of each job status and total applications
* Screenshot Upload Support
  * Upload an image of the job posting for future reference
* Dark Mode Support
  * Toggle between light and dark themes, with local storage persistence
* Framer Motion Animations
  * Smooth UI transitions and interactive button effects

## Technologies Used

* React.js
* Tailwind CSS
* Framer Motion
* Supabase (Auth, Database, Storage)
* Vite

## Usage

* Log In / Sign Up: Create or access your account
* Add a Job: Fill out the form and click “Add Job”
* Filter / Sort: Use dropdowns to filter and sort applications
* View Details: Click the status button of a job to see full details and screenshot
* Edit Job: While viewing job details, click "Edit" to update info
* Delete Job: Click the “X” icon to remove an entry
* View Stats: Click the “ View Stats” button to open the statistics panel
* Toggle Theme: Use the light/dark mode switch
* Log Out: Safely log out with a single click
