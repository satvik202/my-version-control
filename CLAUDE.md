# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`myvcs` is a Git-inspired version control system built from scratch in Node.js. The goal is to implement Git internals (content-addressable object store, staging area, commit history, branches, checkout, diff, merge) as a working CLI — not to replace Git, but to understand it by building it.

See [goal.md](goal.md) for the full spec, planned commands, and build phases.

## Commands

```bash
# Run the CLI (once bin/myvcs.js exists)
node bin/myvcs.js <command>

# Or after `npm link` / `npm install -g .`
myvcs <command>

# Install dependencies
npm install
```

## Tech Stack

- **Runtime:** Node.js with ESM modules (`"type": "module"` in package.json)
- **CLI framework:** `commander`
- **Output:** `chalk` for colored output
- **Hashing:** `crypto.createHash('sha1')` — same algorithm as Git
- **Compression:** `zlib` — same loose-object format as Git
- No other external dependencies

## Architecture

### Source layout

```
bin/myvcs.js          # CLI entry: registers all subcommands via commander
src/
  repository.js       # Find repo root (.myvcs/), read/write raw loose objects
  index.js            # Staging area: read/write .myvcs/index (JSON)
  refs.js             # HEAD and branch refs (.myvcs/refs/heads/)
  objects/
    blob.js           # Hash and store file content
    tree.js           # Build and read directory snapshots (filename → SHA)
    commit.js         # Create and parse commit objects
  commands/           # One file per CLI subcommand
```

### .myvcs/ on-disk format (mirrors .git/)

```
.myvcs/
  objects/<2-char prefix>/<remaining SHA>   # zlib-compressed loose objects
  refs/heads/<branch-name>                  # plain text file containing a SHA
  HEAD                                      # "ref: refs/heads/main" or raw SHA
  index                                     # JSON staging area
```

### Object model

Three immutable object types, each stored by SHA-1 of its content:

- **Blob** — raw file bytes
- **Tree** — directory snapshot: list of `(mode, name, sha)` entries pointing to blobs or subtrees
- **Commit** — points to a root tree SHA, parent commit SHA(s), author metadata, and message

Unchanged files across commits share the same blob SHA; they are stored only once.

### Data flow for `myvcs commit`

1. `index.js` reads the staged entries from `.myvcs/index`
2. `objects/tree.js` builds tree objects bottom-up from staged paths
3. `objects/commit.js` writes a commit object pointing to the root tree
4. `refs.js` advances the current branch ref to the new commit SHA

## Build Phases

The project is implemented incrementally. Each phase adds working commands:

1. Object store: `hash-object`, `cat-file`
2. Repo init: `init`
3. Staging area: `add`, `status`
4. Commits: `commit`
5. History: `log`
6. Branches & HEAD: `branch`
7. Checkout: `checkout`
8. Diff: `diff`
9. *(stretch)* Merge: `merge`
