(function (Scratch) {
  'use strict';

  class Node {
    constructor(target, id) {
      this.target = target; // the sprite/clone (a Scratch target)
      this.id = id;
      // Local transform values
      this.x = 0;
      this.y = 0;
      this.rotation = 0; // in degrees
      // Parent node id (if any)
      this.parent = null;
    }
    // Now, return the stored (relative) transform values without applying parent's transform.
    getRelativeTransform() {
      return { tx: this.x, ty: this.y, trot: this.rotation };
    }
  }

  class TransformExtension {
    constructor() {
      // A dictionary mapping node IDs to Node instances.
      this.nodes = {};
    }

    assignNode(args, util) {
      const id = args.ID.toString();
      const target = util.target;
      if (!this.nodes[id]) {
        this.nodes[id] = new Node(target, id);
      } else {
        // Update the target reference if needed.
        this.nodes[id].target = target;
      }
    }

    setPosition(args, util) {
      const id = args.ID.toString();
      const x = cast.toNumber(args.X);
      const y = cast.toNumber(args.Y);
      if (!this.nodes[id]) {
        this.nodes[id] = new Node(util.target, id);
      }
      this.nodes[id].x = x;
      this.nodes[id].y = y;
      this.updateTransforms(this.nodes[id]);
    }

    setRotation(args, util) {
      const id = args.ID.toString();
      const rotation = cast.toNumber(args.ROT);
      if (!this.nodes[id]) {
        this.nodes[id] = new Node(util.target, id);
      }
      this.nodes[id].rotation = rotation;
      this.updateTransforms(this.nodes[id]);
    }

    setParent(args, util) {
      const childId = args.ID.toString();
      const parentId = args.PARENT_ID.toString();
      if (!this.nodes[childId]) {
        this.nodes[childId] = new Node(util.target, childId);
      }
      // Create a dummy parent if it doesn’t exist.
      if (!this.nodes[parentId]) {
        this.nodes[parentId] = new Node(null, parentId);
      }
      this.nodes[childId].parent = parentId;
      this.updateTransforms(this.nodes[childId]);
    }

    clearParent(args, util) {
      const id = args.ID.toString();
      if (this.nodes[id]) {
        this.nodes[id].parent = null;
        this.updateTransforms(this.nodes[id]);
      }
    }

    getRelativeX(args, util) {
      const id = args.ID.toString();
      if (!this.nodes[id]) return 0;
      const relative = this.nodes[id].getRelativeTransform();
      return relative.tx;
    }

    getRelativeY(args, util) {
      const id = args.ID.toString();
      if (!this.nodes[id]) return 0;
      const relative = this.nodes[id].getRelativeTransform();
      return relative.ty;
    }

    getRelativeRotation(args, util) {
      const id = args.ID.toString();
      if (!this.nodes[id]) return 0;
      const relative = this.nodes[id].getRelativeTransform();
      return relative.trot;
    }

    getParent(args, util) {
      const id = args.ID.toString();
      if (!this.nodes[id]) return "";
      return this.nodes[id].parent || "";
    }

    getChildren(args, util) {
      const id = args.ID.toString();
      const children = [];
      for (const nodeId in this.nodes) {
        if (this.nodes[nodeId].parent === id) {
          children.push(nodeId);
        }
      }
      return children;
    }
    updateTransforms(node) {
      const relative = node.getRelativeTransform();
      if (node.target) {
        // In Scratch, x and y are the sprite’s coordinates,
        // 'direction' is its rotation.
        node.target.setXY(relative.tx, relative.ty);
        node.target.setDirection(relative.trot);
      }
      for (const id in this.nodes) {
        if (this.nodes[id].parent === node.id) {
          this.updateTransforms(this.nodes[id]);
        }
      }
    }
    clearAllNodes(args, util) {
      this.nodes = {};
    }
    getInfo() {
      return {
        id: 'haluTransform',
        name: 'Transform',
        color1: '#6D8196',
        color2: '#546373',
        color3: '#36404A',
        blocks: [
          {
            opcode: 'assignNode',
            blockType: Scratch.BlockType.COMMAND,
            text: 'assign node id [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'node1'
              }
            }
          },
          {
            opcode: 'getParent',
            blockType: Scratch.BlockType.REPORTER,
            text: 'parent of node [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'node1'
              }
            }
          },
          {
            opcode: 'getChildren',
            blockType: Scratch.BlockType.REPORTER,
            text: 'children of node [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'node1'
              }
            }
          },
          {
            opcode: 'setPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set position of node [ID] to x: [X] y: [Y]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'node1'
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'setRotation',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set rotation of node [ID] to rotation [ROT]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'node1'
              },
              ROT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'setParent',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set parent of node [ID] to parent [PARENT_ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'node1'
              },
              PARENT_ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'parent1'
              }
            }
          },
          {
            opcode: 'clearParent',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear parent of node id [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'node1'
              }
            }
          },
          {
            opcode: 'getRelativeX',
            blockType: Scratch.BlockType.REPORTER,
            text: 'relative x of node [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'node1'
              }
            }
          },
          {
            opcode: 'getRelativeY',
            blockType: Scratch.BlockType.REPORTER,
            text: 'relative y of node [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'node1'
              }
            }
          },
          {
            opcode: 'getRelativeRotation',
            blockType: Scratch.BlockType.REPORTER,
            text: 'relative rotation of node [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'node1'
              }
            }
          },
          {
            opcode: 'clearAllNodes',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear parent of all nodes'
          }
        ]
      };
    }
  }

  Scratch.extensions.register(new TransformExtension());
})(Scratch);
