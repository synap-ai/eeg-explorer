# Synap.ai EEG Explorer

[![Build Status](https://travis-ci.com/synap-ai/eeg-explorer.svg?branch=master)](https://travis-ci.com/synap-ai/eeg-explorer)

Connect to the Muse EEG Headset (2016 Edition) through Web Bluetooth

[Current Build](https://synap-ai.github.io/eeg-explorer/)

![muse-eeg-app screen shot](screenshot.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run this application you will need [Node.js](https://nodejs.org) (version 10.15.1). This will include `npm`, needed
to install dependencies.

### Building

1. Install Angular CLI

```
npm i -g @angular/cli
```

2. Install dependencies

```
npm i
```

3. Serve application

```
ng serve -o
```

### Testing

Running unit tests

```
npm run test
```

Running e2e tests

```
ng e2e
```

## Deployment

There are several ways to deploy this application, the steps listed below are the simplest.

1. Start with the production build

```
ng build --prod
```

2. Copy everything within the dist/ folder to a folder on the server.

3. Configure the server to redirect requests for missing files to index.html.

## License

Copyright (C) 2017, Alex Castillo and Uri Shaked. 
Code released under the MIT license.