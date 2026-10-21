# Changelog

## 0.4.1

- Rename the package, repository and bundle row again, to `dsh-update-safe`: the npm name `dsh-update-plugin` is an unowned stub with no versions, while `dsh-update-safe` is free.
- 0.4.0 was published on GitHub only; npm never had a version of this plugin.
- Keep the `safe-release-update` configuration id, RPC routes, supervisor lock and update data directory.
- Publish to npm as `dsh-update-safe@0.4.1`; npm and the release asset contain the same files.

## 0.4.0

- Rename the package, repository and bundle row to `dsh-update-plugin`; the npm name `dsh-upgrade` belongs to another author's plugin.
- Keep the `safe-release-update` configuration id, RPC routes, supervisor lock and update data directory, so settings and update records survive the rename.
- Point installation instructions at the pinned release asset URL instead of a local tarball path.

## 0.3.8

- Cache complete version-checked archives with a SHA-256 checksum; reuse intact copies when preparation is retried.

- Fetch official release metadata through bounded curl requests, avoiding Node fetch connection failures on this installation.

- Replace the fixed 120-second archive limit with a validated, configurable download budget (default one hour), a connection deadline and bounded transient retries.
- Show slow-download guidance and expose the download budget in advanced settings.

## 0.3.5

- Download official tagged HTTPS archives instead of stalled Git clones.
- Allow preparation retry after failure and report its phase.
- Keep unsupervised instances from overwriting supervisor status.

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
