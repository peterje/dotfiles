---
name: create-a-pr
description: Create GitHub pull requests with conventional commit titles, lowercase narrative bodies, h3/h4-only structure, and reliable gh CLI heredoc formatting.
---

Create a pull request:

Use conventional commits for commits and PR title.
Use lowercase for the pr body.
Only use up to ### h3 and h4.
Use a HEREDOC + GH cli to ensure formatting works.

example:
```sh
gh pr create \
  --title "chore: simplify local onboarding" \
  --body "$(cat <<'EOF'
ahead of some new developers in the codebase, this pr provides an up-to-date and hopefully simpler onboarding guide.

### changes
#### 1. stop recommending devcontainers.
devcontainer support was added with hopes of simplification, but the optionality of devcontainer _or_ native bifurcated development environments. combined with the technical complexity of running docker-in-docker, devcontainers are overall net negative. the updated guide has developers install dependencies on their host machine and running all containers directly.

#### 2. clarify `@apps/web`'s dependency on `@apps/api`
most development work doesn't require the export api running locally. it's a huge container and can be omitted for most work. we'll update our vercel environment variables in the development stage to include `API_URL=https://coteachapi-production.up.railway.app`, so you can work on the web app and just hit the production export api when needed.

#### 3. remove `/docs`
these docs were ai generated and mostly unhelpful. any information about these subsystems can be more accurately answered by asking an agent `"explain how X works in this codebase"`
EOF
)"
```

notice:
 - we use a heredoc for formatting
 - use a conventional commit title
 - we use a narrative format - not super technical. explain what changed and why, not specific code references or pedantic details.
