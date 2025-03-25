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
    constructor(runtime) {
      this.runtime = runtime;
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
      const x = Number(args.X);
      const y = Number(args.Y);
      if (!this.nodes[id]) {
        this.nodes[id] = new Node(util.target, id);
      }
      this.nodes[id].x = x;
      this.nodes[id].y = y;
      this.updateTransforms(this.nodes[id]);
    }

    setRotation(args, util) {
      const id = args.ID.toString();
      const rotation = Number(args.ROT);
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
        id: 'transform',
        name: 'Transform',
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
            text: 'node id [ID] parent',
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
            text: 'node id [ID] children',
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
            text: 'node id [ID] set position to x: [X] y: [Y]',
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
            text: 'node id [ID] set rotation to [ROT]',
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
            text: 'node id [ID] set parent to [PARENT_ID]',
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
          // New block: clear parent of node id [ID]
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
            text: 'node id [ID] relative x',
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
            text: 'node id [ID] relative y',
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
            text: 'node id [ID] relative rotation',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'node1'
              }
            }
          },
          // remove every parent flag
          {
            opcode: 'clearAllNodes',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear all nodes and break all relationships'
          }
        ]
      };
    }
  }

  Scratch.extensions.register(new TransformExtension());
})(Scratch);
