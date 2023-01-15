import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest} from './utils.js';
import { getShuffledOptions, getResult } from './game.js';
import {
  cmdList,
  HasGuildCommands,
} from './commands.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
    var command = cmdList.find(c => c.name==name)
    console.log("command: "+command)
    command.func(req, res, id)
  }
  
  // if (type === InteractionType.MESSAGE_COMPONENT) {
  // // custom_id set in payload when sending message component
  // const componentId = data.custom_id;

  //   if (componentId.startsWith('accept_button_')) {
  //     // get the associated game ID
  //     const gameId = componentId.replace('accept_button_', '');
  //     // Delete message with token in request body
  //     const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
  //     try {
  //       await res.send({
  //         type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  //         data: {
  //           // Fetches a random emoji to send from a helper function
  //           content: 'What is your object of choice?',
  //           // Indicates it'll be an ephemeral message
  //           flags: InteractionResponseFlags.EPHEMERAL,
  //           components: [
  //             {
  //               type: MessageComponentTypes.ACTION_ROW,
  //               components: [
  //                 {
  //                   type: MessageComponentTypes.STRING_SELECT,
  //                   // Append game ID
  //                   custom_id: `select_choice_${gameId}`,
  //                   options: getShuffledOptions(),
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       });
  //       // Delete previous message
  //       await DiscordRequest(endpoint, { method: 'DELETE' });
  //     } catch (err) {
  //       console.error('Error sending message:', err);
  //     }
  //   } else if (componentId.startsWith('select_choice_')) {
  //     // get the associated game ID
  //     const gameId = componentId.replace('select_choice_', '');

  //     if (activeGames[gameId]) {
  //       // Get user ID and object choice for responding user
  //       const userId = req.body.member.user.id;
  //       const objectName = data.values[0];
  //       // Calculate result from helper function
  //       const resultStr = getResult(activeGames[gameId], {
  //         id: userId,
  //         objectName,
  //       });

  //       // Remove game from storage
  //       delete activeGames[gameId];
  //       // Update message with token in request body
  //       const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

  //       try {
  //         // Send results
  //         await res.send({
  //           type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  //           data: { content: resultStr },
  //         });
  //         // Update ephemeral message
  //         await DiscordRequest(endpoint, {
  //           method: 'PATCH',
  //           body: {
  //             content: 'Nice choice ' + getRandomEmoji(),
  //             components: []
  //           }
  //         });
  //       } catch (err) {
  //         console.error('Error sending message:', err);
  //       }
  //     }
  //   }
  // }
  
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);

  // Check if guild commands from commands.json are installed (if not, install them. discard non-defined commands)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID);
});