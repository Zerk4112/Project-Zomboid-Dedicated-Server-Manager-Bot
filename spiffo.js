// this is just to figure out winner + verb
import { exec }from 'node:child_process';
import { waitForDebugger } from 'node:inspector';
import { Rcon } from "rcon-client"
const rconUrl = process.env.RCON_URL
const rconKey = process.env.RCON_KEY
const rconPort = process.env.RCON_PORT
var responses = []

function chunkString(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

const PZChoices = {
  restart: {
    description: 'Restart the container',
    func: async function(req, res, id) {
      const userId = req.body.member.user.id;
      var output = await getRconInfo("quit")
      
      return `<@${userId}>:\n ${output} command received successfully`
    }
  },
  players: {
    description: 'List all connected players',
    func: async function(req, res, id) {
      const userId = req.body.member.user.id;
      var output = await getRconInfo("players")
      console.log("rcon cmd output: "+output)
      
      return `<@${userId}>:\n ${output}`
    }
  },
  save: {
    description: 'Save the current world.',
    func: async function(req, res, id) {
      const userId = req.body.member.user.id;
      var output = await getRconInfo("save")
      console.log("rcon cmd output: "+output)
      
      return `<@${userId}>:\n ${output}`
    }
  },

};
  
async function getRconInfo(cmd) {
  const rcon = await Rcon.connect({
    host: rconUrl, port: rconPort, password: rconKey
  })
  var output = await rcon.send(cmd)
  console.log("rcon cmd output: "+output)
  return output
}

export function getPZChoicesList() {
  return Object.keys(PZChoices);
}

export function getPZChoices() {
  return PZChoices;
}
  