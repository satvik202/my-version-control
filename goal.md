# MyVersionCtrl — Project Goal

## What is this?

`myvcs` is a Git-inspired version control system built from scratch in Node.js.
The purpose is not to replace Git — it is to understand exactly how Git works by implementing each piece ourselves: content-addressable storage, the staging area, commit history, branches, checkout, diffs, and merge.

Every phase produces a working CLI tool. You can run it, inspect the internals, and see the raw objects on disk.

---

## Object Model

The core insight of any modern VCS is that **everything is an immutable object addressed by its content hash**.

```
Blob   — the raw bytes of a single file
  |
Tree   — a directory snapshot: maps filenames → blob/tree SHAs
  |
Commit — points to a tree + parent commit(s) + author + message
```

When you commit, you are not storing diffs. You are storing a complete snapshot of your project tree, where unchanged files are just re-referenced (same SHA = same blob, stored only once).

---

## Planned Commands

| Command | What it does |
|---|---|
| `myvcs init` | Initialize a new `.myvcs/` repository in the current directory |
| `myvcs hash-object <file>` | Compute and store the SHA hash of a file as a blob object |
| `myvcs cat-file <sha>` | Print the content of any stored object by its SHA |
| `myvcs add <path>` | Stage a file (add it to the index) |
| `myvcs status` | Show what's staged vs unstaged vs untracked |
| `myvcs commit -m "msg"` | Create a commit from the current index |
| `myvcs log` | Walk the commit chain and print history |
| `myvcs branch` | List branches |
| `myvcs branch <name>` | Create a new branch at the current commit |
| `myvcs checkout <branch\|sha>` | Switch branches or restore working tree to a commit |
| `myvcs diff` | Show changes between working tree and the index |
| `myvcs merge <branch>` | Three-way merge another branch into the current one |

---

## Tech Stack

- **Runtime:** Node.js with ESM modules
- **CLI:** `commander`
- **Output:** `chalk` (colored status/diff output)
- **Hashing:** Node built-in `crypto.createHash('sha1')` — same as Git
- **Compression:** Node built-in `zlib` — same as Git's loose object format
- **No other dependencies** — everything else is standard library

---

## Repository Layout

```
MyVersionCtrl/
├── bin/
│   └── myvcs.js              # CLI entry — registers all subcommands
├── src/
│   ├── repository.js         # Find repo root, read/write raw objects
│   ├── objects/
│   │   ├── blob.js           # Hash and store file content
│   │   ├── tree.js           # Build and read directory snapshots
│   │   └── commit.js         # Create and parse commit objects
│   ├── index.js              # Staging area (read/write .myvcs/index)
│   ├── refs.js               # Branches and HEAD
│   └── commands/
│       ├── init.js
│       ├── add.js
│       ├── status.js
│       ├── commit.js
│       ├── log.js
│       ├── branch.js
│       ├── checkout.js
│       ├── diff.js
│       └── merge.js
└── package.json
```

The `.myvcs/` directory (created inside any repo you run `myvcs init` in) mirrors Git's `.git/`:

```
.myvcs/
├── objects/         # content-addressable store (2-char prefix subdirs)
│   └── ab/
│       └── cdef...  # loose object files
├── refs/
│   └── heads/       # one file per branch, containing a commit SHA
├── HEAD             # ref: refs/heads/main  (or a raw SHA for detached HEAD)
└── index            # JSON staging area
```

---

## Build Phases

- [ ] **Phase 1** — Object store: `hash-object`, `cat-file`
- [ ] **Phase 2** — Repository init: `myvcs init`
- [ ] **Phase 3** — Staging area: `myvcs add`, `myvcs status`
- [ ] **Phase 4** — Commits: `myvcs commit`
- [ ] **Phase 5** — History: `myvcs log`
- [ ] **Phase 6** — Branches & HEAD: `myvcs branch`
- [ ] **Phase 7** — Checkout: `myvcs checkout`
- [ ] **Phase 8** — Diff: `myvcs diff`
- [ ] **Phase 9** *(stretch)* — Merge: `myvcs merge`

---

## End-to-End Smoke Test (after Phase 7)

```bash
mkdir test-repo && cd test-repo
myvcs init

echo "hello" > hello.txt
myvcs add hello.txt
myvcs commit -m "first commit"

myvcs branch feature
myvcs checkout feature

echo "world" >> hello.txt
myvcs add hello.txt
myvcs commit -m "add world"

myvcs log
myvcs checkout main
myvcs diff feature
```

---

## Why build this?

Reading about Git internals is one thing. The moment you implement `hash-object` yourself and see that `echo "hello" | sha1sum` matches what your tool stores on disk — that's when it clicks. This project is that moment, repeated for every concept in version control.
