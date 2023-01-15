import { getRPSChoices } from './game.js';
import { getPZChoices } from './spiffo.js';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest, capitalize } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';
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
  try {
    await DiscordRequest(endpoint, { method: 'POST', body: command });
  } catch (err) {
    console.error(err);
  }
}

// Get the game choices from game.js
function createPZChoices() {
  const choices = getPZChoices();
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
    name: 'test1',
    description: 'Basic guild command',
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
    name: 'pzserver',
    description: 'Manage the servers Project Zomboid Server Container',
    func: function(req, res, id) {
      const userId = req.body.member.user.id;
      // User's object choice
      const objectName = req.body.data.options[0].value;


      return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
          // Fetches a random emoji to send from a helper function
          content: `PZServer Test <@${userId}>`,
          components: [
          {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
              {
                  type: MessageComponentTypes.BUTTON,
                  // Append the game ID to use later on
                  custom_id: `accept_button_${req.body.id}`,
                  label: 'WIP',
                  style: ButtonStyleTypes.PRIMARY,
              },
              ],
          },
          ],
      },
      });
  },
    options: [
      {
        type: 3,
        name: 'object',
        description: 'Pick an action',
        required: true,
        choices: createPZChoices(), 
      },
    ],
    type: 1,
  },
  // {
  //   name: 'challenge',
  //   description: 'Challenge to a match of rock paper scissors',
  //   func: function(req,id){
  //       {
  //         const userId = req.body.member.user.id;
  //         // User's object choice
  //         const objectName = req.body.data.options[0].value;

  //         // Create active game using message ID as the game ID
  //         activeGames[id] = {
  //             id: userId,
  //             objectName,
  //         };

  //         return res.send({
  //         type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  //         data: {
  //             // Fetches a random emoji to send from a helper function
  //             content: `Rock papers scissors challenge from <@${userId}>`,
  //             components: [
  //             {
  //                 type: MessageComponentTypes.ACTION_ROW,
  //                 components: [
  //                 {
  //                     type: MessageComponentTypes.BUTTON,
  //                     // Append the game ID to use later on
  //                     custom_id: `accept_button_${req.body.id}`,
  //                     label: 'Accept',
  //                     style: ButtonStyleTypes.PRIMARY,
  //                 },
  //                 ],
  //             },
  //             ],
  //         },
  //         });
  //     }
  //   },
  //   options: [
  //     {
  //       type: 3,
  //       name: 'object',
  //       description: 'Pick your object',
  //       required: true,
  //       choices: createCommandChoices(),
  //     },
  //   ],
  //   type: 1,
  // }
]
