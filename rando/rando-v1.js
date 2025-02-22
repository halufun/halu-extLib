(function(Scratch) {
  'use strict';
  class HaluRando {
    getInfo() {
      return {
        id: 'haluRando',
        name: 'Random stuff',
        blocks: [
          {
            opcode: 'hexBetween',
            blockType: Scratch.BlockType.REPORTER,
            text: 'blend [HEX1] and [HEX2]',
            arguments: {
              HEX1: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#F00'
              },
              HEX2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#00F'
              }
            }
          }
        ]
      };
    }
    hexBetween({ HEX1, HEX2 }) {
      function componentToHex(c) {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }
      function parseHex(hex) {
        if (typeof hex !== 'string') return { r: 0, g: 0, b: 0, a: 255 };
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) {
          hex = hex.split('').map(ch => ch + ch).join('') + 'FF';
        } else if (hex.length === 4) {
          hex = hex.split('').map(ch => ch + ch).join('');
        } else if (hex.length === 6) {
          hex += 'FF';
        } else if (hex.length !== 8) {
          hex = '000000FF';
        }
        if (!/^[0-9A-Fa-f]{8}$/.test(hex)) {
          return { r: 0, g: 0, b: 0, a: 255 };
        }
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const a = parseInt(hex.substring(6, 8), 16);
        return { r, g, b, a };
      }
      const color1 = parseHex(HEX1);
      const color2 = parseHex(HEX2);
      const r = Math.round((color1.r + color2.r) / 2);
      const g = Math.round((color1.g + color2.g) / 2);
      const b = Math.round((color1.b + color2.b) / 2);
      const a = Math.round((color1.a + color2.a) / 2);
      if (a === 255) {
        return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
      } else {
        return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a);
      }
    }
  }
  Scratch.extensions.register(new HaluRando());
})(Scratch);
