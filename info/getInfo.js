(function(Scratch) {
  'use strict';

  class ProjectDataExtension {
    getInfo() {
      return {
        id: 'haluGetVariables',
        name: 'Variables Info',
        color1: '#E65C00',
        color2: '#CC5200',
        color3: '#B34700',
        blocks: [
          {
            opcode: 'getAllLists',
            blockType: Scratch.BlockType.REPORTER,
            text: 'all lists in project'
          },
          {
            opcode: 'getAllVariables',
            blockType: Scratch.BlockType.REPORTER,
            text: 'all variables in project'
          }
        ]
      };
    }

    getAllLists() {
      const lists = [];
      const stage = Scratch.vm.runtime.getTargetForStage();
      const sprites = Scratch.vm.runtime.targets;

      // Get all lists from all targets (stage and sprites)
      for (const target of sprites) {
        const targetLists = Object.values(target.variables).filter(
          variable => variable.type === 'list'
        );
        for (const list of targetLists) {
          // Only add if not already in array (avoid duplicates from global lists)
          if (!lists.includes(list.name)) {
            lists.push(list.name);
          }
        }
      }

      return JSON.stringify(lists);
    }

    getAllVariables() {
      const variables = [];
      const sprites = Scratch.vm.runtime.targets;

      // Get all variables from all targets (stage and sprites)
      for (const target of sprites) {
        const targetVars = Object.values(target.variables).filter(
          variable => variable.type === '' || variable.type === 'scalar'
        );
        for (const variable of targetVars) {
          // Only add if not already in array (avoid duplicates from global variables)
          if (!variables.includes(variable.name)) {
            variables.push(variable.name);
          }
        }
      }

      return JSON.stringify(variables);
    }
  }

  Scratch.extensions.register(new ProjectDataExtension());
})(Scratch);
