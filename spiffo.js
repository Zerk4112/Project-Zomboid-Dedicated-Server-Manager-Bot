// this is just to figure out winner + verb
const PZChoices = {
    restart: {
      description: 'Restart the container',
      func: function() {}
    }
  };
  
  export function getPZChoices() {
    return Object.keys(PZChoices);
  }
  