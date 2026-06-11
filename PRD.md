# Job Pipeline Tracker — PRD

## Problem

Job seekers track applications in spreadsheets that don't show funnel health, or in SaaS tools that require accounts and store sensitive career data on someone else's server. Job search data (companies, stages, rejections, notes about interviewers) is sensitive. It should not need to leave the user's machine just to be organized.

## Solution

A local-first, single-page web app. All data lives in the visitor's own browser (IndexedDB). No backend, no accounts, no analytics, no network calls after page load. Backup and portability via JSON export/import. Anyone can open the public link and start tracking their own search immediately.

## Users

- Primary: active job seekers managing 10-50 parallel applications
- Secondary: reviewers/visitors exploring the app via the built-in demo dataset

## Core features (v1)

1. **Applications table**: company, role, link, source, stage (Applied / Screen / Interview / Offer / Rejected / Withdrawn), date applied, last activity, next action + date, notes. Add, edit, delete. Sort by stage or date. Filter by stage.
2. **Funnel view**: counts per stage (Applications → Screens → Interviews → Offers) as SVG bars with conversion percentages.
3. **JSON export / import**: full backup and restore of the local database.
4. **Demo mode**: "Load demo data" seeds ~15 realistic fictional applications; "Clear all data" wipes the database.
5. **Privacy note**: visible one-liner stating data is stored only in the browser.

## Out of scope (v1)

Accounts, sync, multi-device, reminders, notifications, server-side anything.

## Architecture

- Vite + React + TypeScript, static bundle
- Dexie (IndexedDB) for persistence
- Hand-rolled SVG funnel, no chart library
- Deployed as static files behind nginx on a VPS

## Key product decision

Privacy by architecture: client-side storage is not a workaround for not having a backend, it is the point. The app cannot leak user data because it never receives it.
