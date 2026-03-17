# Project Brief

## Product
A personal mobile web dashboard for my Hong Kong morning commute.

## Core question
Can I still take the bus?

## Context
I usually prefer taking the bus. I want one simple dashboard that helps me decide whether my normal bus commute is still practical today.

## Target platform
iPhone browser.

## Main commute options
- Preferred bus route
- Backup bus route
- Train fallback

## V1 features
- KMB and Citybus ETA for saved route/stop combinations
- Traffic condition between home and work
- Weather at home and work
- Commute-related alerts, mainly road accidents
- A simple verdict at the top of the dashboard

## V1 non-goals
- Route optimization
- Search UI for routes or stops
- GTFS integration
- Maps
- Live vehicle positions
- User login
- Push notifications
- General news feed

## Product behavior
The dashboard should help answer the question in under 5 seconds.
It should be simple, mobile-first, and easy to read.

## Technical preferences
- Keep architecture simple
- Prefer beginner-friendly choices
- Avoid unnecessary libraries
- No database for v1
- Manual config is acceptable
- Normalize API data into simple internal models

## Working style for Codex
- Explain before coding
- Implement one step at a time
- Do not add extra features unless asked
- Keep file structure minimal
- State assumptions clearly
- Avoid overengineering
