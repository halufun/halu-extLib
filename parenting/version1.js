class ObjectFamilyExtension {
  constructor() {
    // Registry of objects keyed by composite key "family:id"
    // Each value is { target, id, family, offset }
    this.objects = {};
    // Registry of families: { familyName: { parent: compositeKey, children: [compositeKey, ...] } }
    this.families = {};
  }

  getInfo() {
    return {
      id: 'objectFamily',
      name: 'Object Family',
      blocks: [
        {
          opcode: 'newObjectWithId',
          blockType: Scratch.BlockType.COMMAND,
          text: 'new object with id: [ID] in family: [FAMILY]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
            FAMILY: { type: Scratch.ArgumentType.STRING, defaultValue: 'none' }
          }
        },
        {
          opcode: 'makeParentOfFamily',
          blockType: Scratch.BlockType.COMMAND,
          text: 'make object [ID] in family [FAMILY] the parent',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
            FAMILY: { type: Scratch.ArgumentType.STRING, defaultValue: 'family1' }
          }
        },
        {
          opcode: 'putObjectUnderFamily',
          blockType: Scratch.BlockType.COMMAND,
          text: 'move object [ID] from family [OLD_FAMILY] to family [NEW_FAMILY]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
            OLD_FAMILY: { type: Scratch.ArgumentType.STRING, defaultValue: 'none' },
            NEW_FAMILY: { type: Scratch.ArgumentType.STRING, defaultValue: 'family1' }
          }
        },
        {
          opcode: 'setObjectTransform',
          blockType: Scratch.BlockType.COMMAND,
          text: 'set object [ID] in family [FAMILY] transform to x: [X] y: [Y] deg: [DEG]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
            FAMILY: { type: Scratch.ArgumentType.STRING, defaultValue: 'none' },
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            DEG: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
          }
        },
        // Reporter blocks:
        {
          opcode: 'reportObjectId',
          blockType: Scratch.BlockType.REPORTER,
          text: 'object id of [ID] in family [FAMILY]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
            FAMILY: { type: Scratch.ArgumentType.STRING, defaultValue: 'none' }
          }
        },
        {
          opcode: 'reportChildrenOfFamily',
          blockType: Scratch.BlockType.REPORTER,
          text: 'children of family [FAMILY]',
          arguments: {
            FAMILY: { type: Scratch.ArgumentType.STRING, defaultValue: 'family1' }
          }
        },
        {
          opcode: 'reportParentOfObject',
          blockType: Scratch.BlockType.REPORTER,
          text: 'parent of [ID] in family [FAMILY]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
            FAMILY: { type: Scratch.ArgumentType.STRING, defaultValue: 'family1' }
          }
        },
        {
          opcode: 'reportXOfObject',
          blockType: Scratch.BlockType.REPORTER,
          text: 'x of [ID] in family [FAMILY]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
            FAMILY: { type: Scratch.ArgumentType.STRING, defaultValue: 'none' }
          }
        },
        {
          opcode: 'reportYOfObject',
          blockType: Scratch.BlockType.REPORTER,
          text: 'y of [ID] in family [FAMILY]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
            FAMILY: { type: Scratch.ArgumentType.STRING, defaultValue: 'none' }
          }
        },
        {
          opcode: 'reportDegOfObject',
          blockType: Scratch.BlockType.REPORTER,
          text: 'deg of [ID] in family [FAMILY]',
          arguments: {
            ID: { type: Scratch.ArgumentType.STRING, defaultValue: '1' },
            FAMILY: { type: Scratch.ArgumentType.STRING, defaultValue: 'none' }
          }
        }
      ]
    };
  }

  // Helper: generate composite key from family and id.
  _makeKey(family, id) {
    return `${family}:${id}`;
  }

  // 1. Register a new object with a given id and family.
  newObjectWithId(args, util) {
    const id = String(args.ID);
    const family = String(args.FAMILY);
    const key = this._makeKey(family, id);
    util.target._objectID = id;
    util.target._objectFamily = family;
    util.target._compositeKey = key;
    this.objects[key] = {
      target: util.target,
      id: id,
      family: family,
      offset: { x: 0, y: 0, deg: 0 }
    };
  }

  // 2. Designate an object (identified by id and family) as the parent of that family.
  makeParentOfFamily(args, util) {
    const id = String(args.ID);
    const newFamily = String(args.FAMILY);
    const oldFamily = util.target._objectFamily || "none";
    const oldKey = this._makeKey(oldFamily, id);
    if (!this.objects[oldKey]) return;
    const objectData = this.objects[oldKey];
    delete this.objects[oldKey];
    objectData.family = newFamily;
    const newKey = this._makeKey(newFamily, id);
    util.target._objectFamily = newFamily;
    util.target._compositeKey = newKey;
    this.objects[newKey] = objectData;
    if (!this.families[newFamily]) {
      this.families[newFamily] = {
        parent: newKey,
        children: []
      };
    } else {
      this.families[newFamily].parent = newKey;
    }
  }

  // 3. Move an object from one family to another.
  putObjectUnderFamily(args, util) {
    const id = String(args.ID);
    const oldFamily = String(args.OLD_FAMILY);
    const newFamily = String(args.NEW_FAMILY);
    const oldKey = this._makeKey(oldFamily, id);
    if (!this.objects[oldKey]) return;
    const objectData = this.objects[oldKey];
    delete this.objects[oldKey];
    objectData.family = newFamily;
    const newKey = this._makeKey(newFamily, id);
    util.target._objectFamily = newFamily;
    util.target._compositeKey = newKey;
    this.objects[newKey] = objectData;
    // Remove the object from the old family's children list.
    if (this.families[oldFamily]) {
      const index = this.families[oldFamily].children.indexOf(oldKey);
      if (index !== -1) {
        this.families[oldFamily].children.splice(index, 1);
      }
      if (this.families[oldFamily].parent === oldKey) {
        this.families[oldFamily].parent = null;
      }
    }
    // Add the object to the new family's children list.
    if (!this.families[newFamily]) {
      this.families[newFamily] = {
        parent: null,
        children: [newKey]
      };
    } else {
      if (this.families[newFamily].parent !== newKey &&
          !this.families[newFamily].children.includes(newKey)) {
        this.families[newFamily].children.push(newKey);
      }
    }
  }

  // 4. Set an object's transform using its id and family.
  setObjectTransform(args, util) {
    const id = String(args.ID);
    const family = String(args.FAMILY);
    const key = this._makeKey(family, id);
    if (!this.objects[key]) return;
    const absX = Number(args.X);
    const absY = Number(args.Y);
    const absDeg = Number(args.DEG);
    const target = this.objects[key].target;
    if (!target) return;
    target.setXY(absX, absY);
    target.direction = Scratch.Cast.toNumber(absDeg);
    this.objects[key].offset = { x: absX, y: absY, deg: absDeg };
  }

  // Reporter: returns the object's id based on provided id and family.
  reportObjectId(args, util) {
    const id = String(args.ID);
    const family = String(args.FAMILY);
    const key = this._makeKey(family, id);
    if (!this.objects[key]) return "";
    return this.objects[key].id;
  }

  // Reporter: returns an array of children IDs for the given family.
  reportChildrenOfFamily(args, util) {
    const family = String(args.FAMILY);
    if (!this.families[family]) return [];
    return this.families[family].children.map(key => key.split(":")[1]);
  }

  // Reporter: returns the parent's id for the object in the specified family.
  reportParentOfObject(args, util) {
    const id = String(args.ID);
    const family = String(args.FAMILY);
    if (!this.families[family]) return null;
    const parentKey = this.families[family].parent;
    if (!parentKey) return null;
    return parentKey.split(":")[1];
  }

  // Reporter: returns the x coordinate for the object in the given family.
  reportXOfObject(args, util) {
    const id = String(args.ID);
    const family = String(args.FAMILY);
    const key = this._makeKey(family, id);
    if (!this.objects[key]) return 0;
    return this.objects[key].target.x || 0;
  }

  // Reporter: returns the y coordinate for the object in the given family.
  reportYOfObject(args, util) {
    const id = String(args.ID);
    const family = String(args.FAMILY);
    const key = this._makeKey(family, id);
    if (!this.objects[key]) return 0;
    return this.objects[key].target.y || 0;
  }

  // Reporter: returns the rotation (deg) for the object in the given family.
  reportDegOfObject(args, util) {
    const id = String(args.ID);
    const family = String(args.FAMILY);
    const key = this._makeKey(family, id);
    if (!this.objects[key]) return 0;
    return this.objects[key].target.direction || 0;
  }
}

Scratch.extensions.register(new ObjectFamilyExtension());
