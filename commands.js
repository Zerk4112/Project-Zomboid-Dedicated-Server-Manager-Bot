import { getPZChoicesList, getPZChoices } from './spiffo.js';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest, capitalize } from './utils.js';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
export async function HasGuildCommands(appId, guildId) {
  if (guildId === '' || appId === '') return;
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c['name']);
      const toInstall = cmdList.map((c) => c['name'])
      console.log(toInstall)
      installedNames.forEach(function(command) {
        // If command is installed on server but not in commands.js, delete it from the server
        if (!toInstall.includes(command)) {
          console.log(`"${command}" does not exist in the application files, and will be removed!`);
          var commandId = data.find(c => c.name==command).id
          console.log("commandId: "+commandId)
          DeleteGuildCommand(appId, guildId, commandId)
        // If command is installed both server and commands.js, ignore it.
        } else if (toInstall.includes(command)){
          console.log(`${command} is already installed`)
        // If command is not installed on the server but is defined in commands.js, install.
        } else {
          console.log(`Installing "${command}"`);
          InstallGuildCommand(appId, guildId, command);
        }
      });
      toInstall.forEach(function(command) {
        if (!installedNames.includes(command)) {
          console.log('Need to install '+command)
          InstallGuildCommand(appId, guildId, command);
        }
      });
      
      
    }
  } catch (err) {
    console.error(err);
  }
}

// Checks for a command
async function HasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c['name']);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command['name'])) {
        console.log(`Installing "${command['name']}"`);
        InstallGuildCommand(appId, guildId, command);
      } else {
        console.log(`"${command['name']}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
// Deletes a command
export async function DeleteGuildCommand(appId, guildId, commandId) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands/${commandId}`;
  // install command
  try {
    await DiscordRequest(endpoint, { method: 'DELETE', body: {} });
  } catch (err) {
    console.error(err);
  }
}
// Installs a command
export async function InstallGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  // install command
  var cmdObj = cmdList.find(c => c.name == command)
  try {
    await DiscordRequest(endpoint, { method: 'POST', body: cmdObj });
  } catch (err) {
    console.error(err);
  }
}

// Get the game choices from game.js
function createPZChoices() {
  const choices = getPZChoicesList();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

export const cmdList = [
  {
    name: 'hello_world',
    description: 'Hello World Sanity Test',
    func: function(req, res, id) {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'hello world ' + getRandomEmoji(),
        },
      });
    },
    type: 1,
  },
  {
    name: 'server',
    description: 'Manage the Project Zomboid Server',
    func: async function(req, res, id) {
      
      // User's object choice
      const cmdName = req.body.data.options[0].value;
      console.log("cmdName: "+cmdName)
      var pzCmds = getPZChoices()
      var message = await pzCmds[cmdName].func(req,res,id)
      return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
          // Fetches a random emoji to send from a helper function
          content: message,
      },
      });
  },
    options: [
      {
        type: 3,
        name: 'command',
        description: 'Pick a Server Command',
        required: true,
        choices: createPZChoices(), 
      },
    ],
    type: 1,
  },
]
