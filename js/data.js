/* ==========================================================================
   AWS Student Builder Group – NCIT
   ALL site content lives here. Edit this file only; no build step needed.

   Socials, events and team are real data. Keep this file up to date.
   ========================================================================== */

window.SBG = {
  site: {
    name: "AWS Student Builder Group",
    short: "AWS SBG NCIT",
    college: "Nepal College of Information Technology",
    tagline: "Beyond Localhost, Through Community",
    blurb:
      "We're a student-led builder community at NCIT, learning and building across Cloud, " +
      "AI and DevOps on AWS. We run hands-on workshops, expert talks, study jams and hackathons, " +
      "where students turn ideas into real applications, add intelligence with AI, automate how " +
      "they ship, and take them beyond localhost.",
    joinUrl: "https://forms.gle/your-join-form",            // TODO: membership form
    email: { user: "awscloudclub", domain: "ncit.edu.np" },  // from Linktree
    memberCount: "400+",                                   // community size (Meetup: 406)
    location: "NCIT, Balkumari, Lalitpur, Nepal",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Nepal+College+of+Information+Technology%2C+Balkumari%2C+Lalitpur",
  },

  /* Platform keys with built-in icons:
     facebook, instagram, linkedin, discord, youtube, github, x, meetup, whatsapp, tiktok */
  socials: [
    // Source: https://linktr.ee/awscloudclubatncit
    { platform: "facebook",  label: "Facebook",  handle: "awsstudentbuildergroupatncit",  url: "https://www.facebook.com/awsstudentbuildergroupatncit" },
    { platform: "instagram", label: "Instagram", handle: "@awsstudentbuildergroupatncit", url: "https://www.instagram.com/awsstudentbuildergroupatncit" },
    { platform: "linkedin",  label: "LinkedIn",  handle: "AWS Builder Club at NCIT",      url: "https://www.linkedin.com/company/aws-builder-club-at-ncit" },
    { platform: "discord",   label: "Discord",   handle: "Join the server",               url: "https://discord.gg/58s54HkCDa" },
    { platform: "tiktok",    label: "TikTok",    handle: "@awssbgatncit",                 url: "https://www.tiktok.com/@awssbgatncit" },
    { platform: "meetup",    label: "Meetup",    handle: "AWS SBG at NCIT · 400+ members", url: "https://www.meetup.com/aws-sbg-at-pokhara-university-nepal-college-of-info-and-tech/" },
  ],

  /* Events are split into Upcoming / Past automatically by `date`.
     type: "Workshop" | "Talk" | "Hackathon" | "Study Jam" | "Meetup"
     image: path like "assets/events/xyz.jpg" (optional; a pattern tile is shown if empty)  */
  events: [
    /* ---- Upcoming events: add new ones here. When none are upcoming, the site
           shows a "Suggest an event" form instead. Fields:
           { title, date: "YYYY-MM-DDTHH:MM", venue, type, description,
             image: "assets/events/x.jpg", registerUrl, meetupUrl }          ---- */

    /* ---- Past events (real, from Meetup) ---- */
    {
      title: "AWSome Beginning",
      date: "2026-05-02T11:00",
      venue: "NCIT, Balkumari, Lalitpur",
      type: "Talk",
      description: "A beginner-friendly intro to AWS: what the cloud is, why it's used after development, and how EC2, S3, IAM, VPC, RDS, Lambda, API Gateway and CloudWatch fit into real applications.",
      attendees: 18,
      image: "assets/events/314509473.jpg",
      meetupUrl: "https://www.meetup.com/aws-sbg-at-pokhara-university-nepal-college-of-info-and-tech/events/314509473/",
    },
    {
      title: "Frontend Backend, No Weekend",
      date: "2026-05-17T11:00",
      venue: "NCIT, Balkumari, Lalitpur",
      type: "Workshop",
      description: "A hands-on session taking a full-stack app from \"works on my machine\" to \"works on the cloud\", step by step, by deploying it on AWS.",
      attendees: 18,
      image: "assets/events/314737819.jpg",
      meetupUrl: "https://www.meetup.com/aws-sbg-at-pokhara-university-nepal-college-of-info-and-tech/events/314737819/",
    },
    {
      title: "Serverless, not server-less",
      date: "2026-05-24T14:00",
      venue: "NCIT, Balkumari, Lalitpur",
      type: "Workshop",
      description: "Covered serverless computing and AWS Lambda, architecture breakdowns and scenario-based design, with hands-on Lambda practice.",
      attendees: 47,
      image: "assets/events/314862095.jpg",
      meetupUrl: "https://www.meetup.com/aws-sbg-at-pokhara-university-nepal-college-of-info-and-tech/events/314862095/",
    },
    {
      title: "AWS Services for Building AI Applications",
      date: "2026-06-04T19:30",
      venue: "Online",
      type: "Talk",
      description: "Run with National AI Hackathon '26. Cloud architect Sushant Paudyal showed which AWS services help you build, deploy and scale AI-powered applications.",
      attendees: 33,
      image: "assets/events/315071768.jpg",
      meetupUrl: "https://www.meetup.com/aws-sbg-at-pokhara-university-nepal-college-of-info-and-tech/events/315071768/",
    },
    {
      title: "Hello Containers!",
      date: "2026-06-20T11:00",
      venue: "NCIT, BCA Department (Block H)",
      type: "Workshop",
      description: "A hands-on first step into containers: Docker fundamentals, storing images in Amazon ECR, and deploying and scaling apps with Amazon ECS.",
      attendees: 23,
      image: "assets/events/315284783.jpg",
      meetupUrl: "https://www.meetup.com/aws-sbg-at-pokhara-university-nepal-college-of-info-and-tech/events/315284783/",
    },
    {
      title: "All Builders Welcome Grant Explained: Requirements, Do's & Don'ts",
      date: "2026-07-05T20:00",
      venue: "Online",
      type: "Talk",
      description: "Lajah Shrestha, a 2025 AWS All Builders Welcome Grant recipient, shared how to prepare a strong application, common mistakes and tips, followed by Q&A.",
      attendees: 81,
      image: "assets/events/315485533.jpg",
      meetupUrl: "https://www.meetup.com/aws-sbg-at-pokhara-university-nepal-college-of-info-and-tech/events/315485533/",
    },
    {
      title: "The Problem Kubernetes Was Built to Solve",
      date: "2026-07-12T20:00",
      venue: "Online",
      type: "Talk",
      description: "Kubestronaut Puru Tuladhar explained why Kubernetes became necessary, what came before it, and how it helps teams run modern apps at scale.",
      attendees: 53,
      image: "assets/events/315593713.jpg",
      meetupUrl: "https://www.meetup.com/aws-sbg-at-pokhara-university-nepal-college-of-info-and-tech/events/315593713/",
    },
  ],

  /* Teams by year. The newest year is shown by default; older years appear as tabs.
     To start a new year's team, copy a block, change `year`, and update the members.
     group: "lead" | "core" | "member"
     Contact details are optional. Email is split into user/domain and assembled in
     the browser to cut down on scraping. Phone numbers are intentionally not shown.
     photo: "assets/members/name.jpg" (optional; initials avatar shown otherwise)          */
  teams: [
    {
      year: 2026,
      members: [
        { name: "Devendra Khatri", role: "Group Leader", group: "lead", program: "BCA · 7th Semester", photo: "assets/members/devendra-khatri.jpg", email: { user: "devendra.232011", domain: "ncit.edu.np" }, linkedin: "https://www.linkedin.com/in/devendra-khatri/" },
        { name: "Aaradhya Pandit", role: "Event Lead", group: "core", program: "BE IT · 3rd Semester", photo: "assets/members/aaradhya-pandit.jpg", email: { user: "aaradhyapandit2k8", domain: "gmail.com" }, instagram: "https://www.instagram.com/aaradhyayayayayaya" },
        { name: "Aakriti Dahal", role: "Media & Marketing Lead", group: "core", program: "BCA · 7th Semester", photo: "", email: { user: "aakriti.232001", domain: "ncit.edu.np" } },
        { name: "Arunima Chand", role: "Operations Lead", group: "core", program: "BE CE · 5th Semester", photo: "assets/members/arunima-chand.jpg", email: { user: "arunima6306", domain: "gmail.com" }, linkedin: "https://www.linkedin.com/in/arunima-chand-23a818345" },
        { name: "Adarsha Pokharel", role: "Technical Lead", group: "core", program: "BCA · 7th Semester", photo: "assets/members/adarsha-pokharel.jpg", email: { user: "adarsh.232004", domain: "ncit.edu.np" }, linkedin: "https://www.linkedin.com/in/adarshapokharel", website: "https://adarshapokharel.com.np" },
        { name: "Snigdha Adhikari", role: "Sponsorship Lead", group: "core", program: "BCA · 7th Semester", photo: "", email: { user: "snigdha.232040", domain: "ncit.edu.np" } },
      ],
    },
  ],
};
