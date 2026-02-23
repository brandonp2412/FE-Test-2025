# FE-test

This repo contains the codebase for the 'Horse API' that is used by FE interview candidates.

## Running locally

To run locally (assuming you have cloned the repo):
```bash
cd src
docker build -t horse_api .
docker run -p 3016:3016 horse_api
```
