<h1 align="center">
  <br>
  <a href="https://github.com/Zerk4112/Project-Zomboid-Dedicated-Server-Manager-Bot"><img src="./docs/img/spiffo.png" height="200" alt="Its spiffo!"></a>
  <br>
  PZBot 0.1
  <br>
</h1>

<p align="center">A Discord Bot for Project Zomboid Dedicated Server Administration.</p>

<br>

## 📦 Prerequisites

- [Node.js](https://nodejs.org/en/) v16.0.0 or higher
- [Git](https://git-scm.com/downloads)
- [Cloud Flare Tunnel - cloudflared (optional)](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/)

## 🚜 Getting Started

- Open the terminal and run the following commands

```
git clone https://github.com/Zerk4112/Project-Zomboid-Dedicated-Server-Manager-Bot.git
cd Project-Zomboid-Dedicated-Server-Manager-Bot
npm install
```

- Wait for all the dependencies to be installed
- Rename `.env.example` to `.env` and fill the values
- Optionally edit `config.js`
- Type `npm app.js` to start the bot
- Optional: If using cloudflared, type `./start_bot.sh` to auto-start this.
