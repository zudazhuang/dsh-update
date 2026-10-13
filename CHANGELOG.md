# Changelog

## 0.3.4

- Snapshot and migrate uncommitted edits and non-ignored new files automatically.
- Keep the original Git index and branch unchanged.
- Invalidate prepared candidates when working files change.
- Report conflicting source filenames instead of disabling updates for all local edits.

## 0.3.3

- Rebuild candidate dependency locks when local dependency settings change.
- Keep old lockfiles out of source patch replay.

## 0.3.2

- Migrate committed local installation changes before building the candidate.
- Reject migration conflicts without modifying the running installation.

## 0.3.1

- Rename the package and repository to `dsh-upgrade`; `dsh-update` is owned by another npm author.
- Retain settings IDs, RPC routes, update storage and login launch job.
- Set the official npm registry for publishing.

## 0.3.0

- Rename the public package and plugin page to `dsh-update`.
- Retain existing settings identifiers, update records, backups and launch job.
- Remove machine-specific source paths from launch scripts and tests.
- Publish a GitHub release with a versioned installable tarball.
- Startup checks, manual checks, periodic checks and idle daily installation windows remain available.

## 0.2.2 (local release)

- Add independent startup and periodic checks with wall-clock scheduling.
- Add local-time daily installation windows and Mac login startup.
- Use Harness buttons and switches, including light and dark themes.
