# AWS Student Builder Group · NCIT website

A static, single-page site. It needs no build step and no Node.js.

```
index.html        page structure
css/styles.css    box-grid theme (colours come from the cover art)
js/data.js        ← ALL content: site info, socials, events, members
js/main.js        renders everything from data.js
assets/           logo, cover, favicon (add events/ and members/ photos here)
```

## Editing content
Edit only **`js/data.js`**. It holds the real socials, events (from Meetup) and the yearly team.

- **Events:** add an object to `events`. It appears under *Upcoming* or *Past* automatically based on `date` (`"YYYY-MM-DDTHH:MM"`, local time). Upcoming events use `registerUrl`. Past events use `recapUrl` and `slidesUrl`. `image` is optional.
- **Team:** teams are grouped by `year` under `teams`. The newest year is shown by default, and older years appear as tabs. Within a team, `group` is `"lead"`, `"core"` or `"member"`. Contact fields are optional, so include only what the member agreed to share:
  - `email: { user, domain }` is stored split and only assembled when someone clicks, which reduces scraping.
  - `linkedin`, `github`, `instagram` and `website` take full URLs.
  - Phone numbers are intentionally not supported.
- **Photos:** put them in `assets/members/` or `assets/events/` and reference the path, e.g. `"assets/members/aarav.jpg"`. Square images work best for members and 16:9 for events.
- **Socials:** `platform` picks the icon. Supported values: facebook, instagram, linkedin, discord, youtube, github, x, meetup, whatsapp, tiktok.

## Run locally
```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy
- **GitHub Pages:** push the folder to a repo, then go to Settings → Pages → deploy from branch `main`, folder `/`.
- **Netlify / Cloudflare Pages:** drag and drop the folder. No build command is needed.
